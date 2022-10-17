import dotenv from "dotenv";
import express, { Request } from "express";
import cors from "cors";
import logger from "morgan";
dotenv.config();

const app = express();

const corsOptionsDelegate = function (
  _req: Request,
  callback: (error: Error | null, options: any) => void
) {
  if (process.env.NODE_ENV !== "production") {
    return callback(null, { origin: true });
  }
  let corsOptions = { origin: true };
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;
