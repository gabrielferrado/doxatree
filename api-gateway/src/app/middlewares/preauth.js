const ExceptionHandler = require('../../utils/exception')

module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  const token = process.env.X_API_KEY

  if (!apiKey) {
    return ExceptionHandler(403, 'Access Denied', res)
  }

  if (!(apiKey === token)) {
    return ExceptionHandler(403, 'Access Denied', res)
  }

  return next()
}
