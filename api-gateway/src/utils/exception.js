const ExceptionsHandler = (code, message, res) => {
  return res.status(code).json({
    statusCode: code,
    message,
  })
}

module.exports = ExceptionsHandler
