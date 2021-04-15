import express  from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();
const PORT = process.env.PORT;

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

routes(app);

app.listen(parseInt(PORT), "0.0.0.0", () => console.info(`[${Date.now()}] - PORTFOLIO SERVICE | listening on port ${PORT}`));
