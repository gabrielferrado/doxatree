const jwt = require('jsonwebtoken')

module.exports = (params = {}) => {
  const { JWT_SECRET } = process.env
  return jwt.sign(params, JWT_SECRET)
}
