import dotenv from "dotenv";
import express, { Request } from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import logger from "morgan";
import swaggerUI from 'swagger-ui-express'
import swaggerDocs from './swagger.json'
dotenv.config();

const app = express();

const corsAllowed = (process.env.CORS_ALLOWED || "").split(",")
const allowList = [
	"https://coin-conversion.herokuapp.com",
	...corsAllowed,
]

const corsOptionsDelegate = function (
  req: Request,
  callback: (error: Error | null, options: any) => void
) {
  if (process.env.NODE_ENV !== "production") {
    return callback(null, { origin: true });
  }
  let corsOptions = { origin: true };
  if (
		allowList.indexOf(req.header("Origin") as string) !== -1
	) {
		corsOptions = { origin: true }
	}
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use(express.urlencoded({ extended: false }));

export default app;
