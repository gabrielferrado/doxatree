const User = require('../models/User')
const bcrypt = require('bcryptjs')
const ExceptionHandler = require('../../utils/exception')
const UserService = require('../services/userService')
const SMSService = require('../services/sms')
const EmailService = require('../services/email')
const generateToken = require('../../utils/token')

exports.sendValidation = async (req, res) => {
  try {
    const { authorization } = req.headers
    const { source } = req.query

    const user = await User.findOne({
      idToken: authorization.replace('Bearer ', ''),
    }).select('+messageToken')

    switch (source) {
      case 'sms': {
        const response = await SMSService.send(user.phone, user.messageToken)
        return res.json(response)
      }
      case 'email': {
        const response = await EmailService.send(user.email, user.messageToken)
        return res.json(response)
      }
      default:
        return ExceptionHandler('400', 'Source not valid', res)
    }
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}
exports.validate = async (req, res) => {
  try {
    const { authorization } = req.headers
    const { code } = req.body

    const user = await User.findOne({
      idToken: authorization.replace('Bearer ', ''),
    }).select('+messageToken password idToken active')

    if (user.active) {
      return ExceptionHandler('403', 'User already active', res)
    }

    if (code !== user.messageToken) {
      return ExceptionHandler('403', 'Code is invalid', res)
    }

    user.active = true
    user.messageToken = null
    await user.save()

    return res.send()
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = req.user

    const foundUser = await User.findOne({ email: user })

    return res.json(foundUser)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}

exports.createPortfolio = async (req, res) => {
  return ExceptionHandler(
    '418',
    'You should not be able to see this error. Please contact us tech@doxatree.com',
    res
  )
}
exports.getPortfolio = async (req, res) => {
  try {
    const user = req.user

    const foundUser = await User.findOne({ email: user })

    if (!foundUser)
      return ExceptionHandler(
        404,
        'User not found',
        res
      )

    const { portfolio } = await UserService.getPortfolio(foundUser._id)

    return res.json(portfolio)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}
exports.updatePortfolio = async (req, res) => {
  try {
    const user = req.user
    const { body } = req

    const foundUser = await User.findOne({ email: user })
    const { portfolio } = await UserService.updatePortfolio(foundUser._id, {
      ...body,
    })
    return res.json(portfolio)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}

exports.updateUser = async (req, res) => {
  try {
    const requesterEmail = req.user
    const { name, avatar, ssn, password, email, phone } = req.body

    const user = await User.findOne({ email: requesterEmail }).select(
      '+password'
    )

    if (user.role !== 'admin') {
      req.body.role = undefined
    }

    if (!user.active && email) {
      user.email = email || user.email
      user.idToken = generateToken(user.email)
    }

    if (!user.active && phone) {
      user.phone = phone
    }

    user.name = name || user.name
    user.avatar = avatar || user.avatar
    user.ssn = ssn || user.ssn

    if (password) {
      user.password = bcrypt.hashSync(password, 10)
    }

    await user.save()

    user.password = undefined
    user.messageToken = undefined

    return res.json({ user })
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}

exports.createLocket = async (req, res) => {
  try {
    const user = req.user
    const { body } = req

    const foundUser = await User.findOne({ email: user })
    const { portfolio } = await UserService.getPortfolio(foundUser._id)

    const response = await UserService.createLocket(portfolio._id, {
      ...body,
    })

    return res.json(response)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}

exports.getAsset = async (req, res) => {
  try {
    const { assetId } = req.params
    const { asset } = await UserService.getAsset(assetId)

    if (!asset) {
      return ExceptionHandler('404', 'Asset not found', res)
    }

    return res.json(asset)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}
exports.createAsset = async (req, res) => {
  try {
    const { body } = req

    const response = await UserService.createAsset(body.locketId, { ...body })

    return res.json(response)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}
exports.updateAsset = async (req, res) => {
  try {
    const { locketId, assetId } = req.body

    const response = await UserService.updateAsset(locketId, assetId, {
      ...req.body,
    })

    return res.json(response)
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}
exports.deleteAsset = async (req, res) => {
  try {
    const { locketId, assetId } = req.body

    await UserService.deleteAsset(locketId, assetId)

    return res.send()
  } catch ({ response }) {
    return ExceptionHandler(
      response.data.statusCode,
      response.data.message,
      res
    )
  }
}
