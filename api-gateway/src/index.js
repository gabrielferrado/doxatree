const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    preflightContinue: true,
    exposedHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept",
      "X-Password-Expired"
    ],
    optionsSuccessStatus: 200
  })
);

require('./app/server/routes')(app)

app.listen(process.env.PORT|| 3000, () => console.info(`[${Date.now()}] - 🚀 SERVER UP AT ${process.env.PORT}`))
