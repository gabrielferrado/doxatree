const User = require('../models/User')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const UserService = require('../services/userService')
const generateToken = require('../../utils/token')
const { mailer } = require('../server/mailer')
const ExceptionHandler = require('../../utils/exception')

const DEFAULT_SSN = '99999999999'

const removeUserFields = (user, inactive) => {
  user.password = undefined
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.messageToken = undefined
  user.idApple = undefined
  user.idGoogle = undefined
  user.idFacebook = undefined
  user.updatedAt = undefined
  user.deletedAt = undefined

  if (inactive) {
    user.active = false
    user.phone = null
    user.ssn = null
  }

  return user
}

exports.oauth = async (req, res) => {
  try {
    const { token } = req.body
    const oauthUser = (
      await axios.get(process.env.SOCIAL_AUTH_LAMBDA_URL, {
        params: {
          token,
        },
      })
    ).data

    const user = await User.findOne({ email: oauthUser.email }).select(
      '+password'
    )

    if (!user) {
      const user = User.create({
        active: true,
        provider: oauthUser.firebase.sign_in_provider.replace('.com', ''),
        name: oauthUser.name,
        email: oauthUser.email,
        avatar: oauthUser.picture,
        idGoogle: oauthUser.uid,
        idToken: generateToken(oauthUser.email),
        phone: 0,
        ssn: DEFAULT_SSN,
        password: oauthUser.uid,
      })
      await UserService.createPortfolio(user._id, { netWorth: 0 })

      return res.json({
        user: removeUserFields(user, true),
      })
    }

    if (!user.phone || user.ssn === DEFAULT_SSN) {
      return res.json({
        user: removeUserFields(user, true),
      })
    }

    res.json(user)
  } catch (e) {
    return ExceptionHandler(500, e.message, res)
  }
}

exports.register = async (req, res) => {
  try {
    req.body.role = undefined
    const user = await User.create({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    })
    await UserService.createPortfolio(user._id, { netWorth: 0 })

    return res.json({ user: removeUserFields(user) })
  } catch (e) {
    return ExceptionHandler(500, e.message, res)
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(403)
        .json({ statusCode: 403, message: 'User or password are invalid' })
    }

    user.password = undefined

    return res.json({ user })
  } catch (e) {
    return ExceptionHandler(500, e.message, res)
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return ExceptionHandler(404, 'User not found, please verify email', res)
    }
    const now = new Date()
    const token = await bcrypt.hash(now.toString(), 10)
    now.setMinutes(now.getMinutes() + 15)

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    })

    await mailer.sendMail({
      to: `${'<'}${email}${'>'}`,
      from: 'tech@doxatree.com',
      template: 'auth/forgot_password',
      subject: 'TEST - NoReply',
      context: { token },
    })

    return res.send()
  } catch (e) {
    console.error(e)
    return ExceptionHandler(500, e.message, res)
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query
    const { email, password } = req.body
    const now = new Date()
    const user = await User.findOne({ email }).select(
      '+passwordResetToken passwordResetExpires'
    )

    console.log(now, user.passwordResetExpires)

    if (!user) return ExceptionHandler(404, 'User not found', res)
    if (token !== user.passwordResetToken) {
      return ExceptionHandler(403, 'Invalid reset token', res)
    }
    if (now > user.passwordResetExpires) {
      return ExceptionHandler(410, 'Expired token, generate a new one', res)
    }

    user.password = password

    await user.save()

    return res.send()
  } catch (e) {
    return ExceptionHandler(500, e.message, res)
  }
}
