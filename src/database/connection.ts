import dotenv from 'dotenv'
dotenv.config({ path: "../../.env" })

import KnexInstance, { Knex as KnexType } from "knex"
import KnexTinyLogger from "knex-tiny-logger"
import Debug from "../common/debug"
const logger = Debug("database")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../config")[process.env.NODE_ENV || "development"]

const knex: KnexType<any, unknown[]> =
	process.env.NODE_ENV !== "production"
		? KnexTinyLogger(KnexInstance(config), { logger })
		: KnexInstance(config)

export default knex
