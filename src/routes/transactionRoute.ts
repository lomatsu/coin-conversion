import { Application } from "express"
import { TransactionController } from "../transaction/TransactionController"
import { ITransactionRepository } from "../repositories"

export const registerTransactionRoutes = (
	app: Application,
	repository: ITransactionRepository,
): void => {
	const controller = new TransactionController(app, repository)
	controller.registerRoutes()
}
