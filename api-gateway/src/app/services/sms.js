const axios = require('axios')

exports.send = async (number, code) => {
  const sms = await axios.get(process.env.SMS_API_URL, {
    params: {
      subject: 'DOXATREE',
      message: `Seu código de confirmação DOXATREE é ${code}`,
      number,
    },
  })

  if (sms.data.Error) {
    throw sms.data.Error.message
  }

  return { messageToken: sms.data.MessageID, code }
}
