const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res
      .status(401)
      .json({ statusCode: 401, message: 'Token not provided' })
  }

  const parts = authorization.split(' ')

  if (!(parts.length === 2)) {
    return res
      .status(403)
      .json({ statusCode: 403, message: 'Missing token parts' })
  }

  const [scheme, token] = parts

  if (!/Bearer/gm.test(scheme)) {
    return res.status(403).json({ statusCode: 403, message: 'Malformed token' })
  }

  try {
    req.user = await jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch (e) {
    return res.status(401).json({ statusCode: 401, message: 'Invalid token' })
  }
}
