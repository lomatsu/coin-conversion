import dotenv from 'dotenv'
import { join } from "path"

if (process.env.NODE_ENV !== "production")
	dotenv.config({ path: join(__dirname, "../..", ".env") })

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "./index"

const connection = {
	host: DB_HOST,
	database: DB_NAME,
	user: DB_USER,
	password: DB_PASSWORD,
}

module.exports = {
	development: {
		client: "pg",
		connection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: "../database/migrations",
		},
		seeds: {
			directory: "../database/seeds",
		},
	},
	test: {
		client: "pg",
		connection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: "../database/migrations",
		},
		seeds: {
			directory: "../database/seeds",
		},
	},
	production: {
    client: 'pg',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      }
    },
    migrations: {
      directory: "../database/migrations",
    },
    seeds: {
      directory: "../database/seeds",
    },
  },
}
