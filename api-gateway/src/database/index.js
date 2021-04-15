const mongoose = require('mongoose')

mongoose.connect(process.env.MONG0_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise

module.exports = mongoose
