#!/usr/bin/env node

/**
 * Module dependencies.
 */
import { Request, Response } from "express"
import app from "../app"
import knex from "../database/connection"
import { tableName } from "../database/helps"
import {
	TransactionRepository
} from "../repositories"
import {
	registerTransactionRoutes,
} from "../routes"

app.use("/api/health-check", (_: Request, res: Response) => {
	res.json({ message: "System OK", env: process.env.NODE_ENV })
})
app.use("/api/health-check-database", (_: Request, res: Response) => {
	knex
		.count("*")
		.from(tableName.USERS)
		.first()
		.then(() => {
			res.json({ msg: "Database OK" })
		})
		.catch((err) => {
			if (err.message === 'database "share-aero" does not exist') {
				res.json({ msg: "Database OK" })
			} else {
				res.json({ error: "Error Database" })
			}
		})
})

// register routes
registerTransactionRoutes(app, new TransactionRepository(knex))

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "5000")
app.set("port", port)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
	const port = parseInt(val, 10)

	if (isNaN(port)) {
		// named pipe
		return val
	}

	if (port >= 0) {
		// port number
		return port
	}

	return false
}
export default app
