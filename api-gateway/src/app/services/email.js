const axios = require('axios')

exports.send = async (email, code) => {
  const response = (
    await axios.get(process.env.EMAIL_LAMBDA_URL, {
      params: {
        destination: email,
        code,
      },
    })
  ).data

  return { statusCode: 200, message: response }
}
