const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'e60106f6c09838',
    pass: '580db43404c098',
  },
})

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
  }),
)

exports.mailer = transport
