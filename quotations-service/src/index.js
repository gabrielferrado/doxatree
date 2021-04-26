import express from "express";
import cors from "cors";
import Services from "./services/index";

const PORT = process.env.PORT || 3000;
const app = express();

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
      "X-Password-Expired",
    ],
    optionsSuccessStatus: 200,
  })
);

Promise.all([Services.scanCrypto(), Services.scanUSA(), Services.scanBR()]);

app.listen(PORT, () =>
  console.info(`[${Date.now()}] - 🚀 QUOTATIONS SERVICE UP AT ${PORT}`)
);
