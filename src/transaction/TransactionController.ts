import { Application, Request, Response } from "express"
import { ControllerBase } from "../common/ControllerBase"
import Debug from "../common/debug"
import { errorResponse } from "../common/utils"
import { checkExchangeRatesAPI } from "../common/utils/checkExchangeRates"
import { TransactionModel } from "../database/model"
import { ITransactionRepository } from "../repositories"
import { IPageOptions } from "../repositories/Repository"
import { TransactionViewModel } from "./TransactionViewModel"
const debug = Debug("transaction-controller")

export class TransactionController extends ControllerBase<ITransactionRepository> {
  public static readonly baseRouter: string = "/api/transactions"
  constructor(app: Application, repository: ITransactionRepository) {
    super(app, repository)
  }
  public async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      let userId: string | number = req.params.userId as string
      if (!userId || +userId < 1) {
        res.status(404).end()
        return
      }
      userId = parseInt(userId, 10)

      let { page = 1, limit = 4 } = req.query as any
      const { sort = "id", direction = "asc" } = req.query as any
      limit = parseInt(limit, 10) || 10
      page = parseInt(page, 10) || 0
      if (page < 1) {
        page = 1
      }
      const options: IPageOptions<TransactionModel> = {
        limit,
        page: page - 1,
        sort,
        direction,
      }
      const { data: transactions, total } = await this.repository.getByUserId(
        userId,
        options
      )
      const data = transactions.map(
        (transaction) => new TransactionViewModel(transaction)
      )
      options.page = page
      const comparaTotal = options.page * options.limit
      let hasNext = false
      if (comparaTotal < total) {
        hasNext = true
      }
      const response = {
        data,
        page: options.page,
        limit: options.limit,
        direction: options.direction,
        total: total,
        hasNext: hasNext,
      }
      res.json(response)
    } catch (error: any) {
      errorResponse(
        "Error on get paginated transactions",
        error,
        500,
        res,
        debug
      )
    }
  }
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      let transactionId: string | number = req.params.id as string
      if (!transactionId || +transactionId < 1) {
        res.status(404).end()
        return
      }
      transactionId = parseInt(transactionId, 10)
      const transaction = await this.repository.getById(transactionId)
      if (!transaction) {
        res.status(404).end()
        return
      }
      const transactionViewModel = new TransactionViewModel(transaction)
      res.json(transactionViewModel)
    } catch (error) {
      errorResponse("Error on get transaction by id", error, 500, res, debug)
    }
  }
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      let { page = 1, limit = 4 } = req.query as any
      const { sort = "id", direction = "asc" } = req.query as any
      limit = parseInt(limit, 10) || 10
      page = parseInt(page, 10) || 0
      if (page < 1) {
        page = 1
      }
      const options: IPageOptions<TransactionModel> = {
        limit,
        page: page - 1,
        sort,
        direction,
      }
      const { data: transactions, total } = await this.repository.getPaginated(
        options
      )
      const data = transactions.map(
        (transaction) => new TransactionViewModel(transaction)
      )
      options.page = page
      const comparaTotal = options.page * options.limit
      let hasNext = false
      if (comparaTotal < total) {
        hasNext = true
      }
      const response = {
        data,
        page: options.page,
        limit: options.limit,
        direction: options.direction,
        total: total,
        hasNext: hasNext,
      }
      res.json(response)
    } catch (error: any) {
      errorResponse(
        "Error on get paginated transactions",
        error,
        500,
        res,
        debug
      )
    }
  }
  public async save(req: Request, res: Response): Promise<void> {
    try {
      // originCurrency, originValue, targetCurrency, coinversionRate
      const transactionModel = new TransactionModel(req.body)
      const errors = transactionModel.validate()
      if (errors.length) {
        res.status(400).json({ message: errors[0] })
        return
      }
      const dataAPI = await checkExchangeRatesAPI()
      if (!dataAPI || dataAPI.success === false) {
        res
          .status(400)
          .json({ message: "Rates not found. Please try again later" })
      }

      const destinationValue = this.convertValues(
        dataAPI.rates,
        transactionModel
      )
      transactionModel.conversion_rate = destinationValue.rate
      const newTransaction = await this.repository.create(transactionModel)
      const transactionViewModel = new TransactionViewModel(newTransaction)
      const response = {
        ...transactionViewModel,
        destinationValue: destinationValue.result,
      }
      res.status(201).json(response)
    } catch (error) {
      errorResponse("Error on save transaction", error, 500, res, debug)
    }
  }
  public async update(req: Request, res: Response) {
    try {
      let id: string | number = req.params.id as string
      if (!id || +id < 1) {
        res.status(404).end()
        return
      }
      id = parseInt(id, 10)
      const data = req.body
      if (!data || !Object.keys(data).length) {
        res.status(400).json({ message: "Body is required for this request" })
        return
      }
      data.id = id
      const transactionModel = new TransactionModel(data)
      const transaction = await this.repository.update(transactionModel)
      const response = new TransactionViewModel(transaction)
      res.json(response)
    } catch (error: any) {
      errorResponse("Error on update transaction", error, 500, res, debug, req)
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      let id: string | number = req.params.id as string
      if (!id || +id < 1) {
        res.status(404).end()
        return
      }
      id = parseInt(id, 10)
      await this.repository.delete(id)
      res.json({ message: "Transaction removed with success" })
    } catch (error: any) {
      errorResponse("Error on delete transaction", error, 500, res, debug, req)
    }
  }

  public async registerRoutes(): Promise<void> {
    this.app.get(
      `${TransactionController.baseRouter}/by-user/:userId`,
      this.getByUserId.bind(this)
    )
    this.app.get(TransactionController.baseRouter, this.getAll.bind(this))
    this.app.get(
      `${TransactionController.baseRouter}/:id`,
      this.getById.bind(this)
    )
    this.app.post(TransactionController.baseRouter, this.save.bind(this))
    this.app.put(
      `${TransactionController.baseRouter}/:id`,
      this.update.bind(this)
    )
    this.app.delete(
      `${TransactionController.baseRouter}/:id`,
      this.delete.bind(this)
    )
  }

  public convertValues(currentRates: any, transaction: any) {
    if (transaction.origin_currency === "EUR") {
      const rate = currentRates[transaction.target_currency]
      const result = this.formatValue(transaction.origin_value * rate)
      return { result, rate }
    }

    if (transaction.target_currency === "EUR") {
      const rate = currentRates[transaction.origin_currency]
      const result = this.formatValue(transaction.origin_value / rate)
      return { result, rate }
    }

    let rate =
      currentRates[transaction.target_currency] /
      currentRates[transaction.origin_currency]

    const result = this.formatValue(transaction.origin_value * rate)
    rate = this.formatValue(rate)
    return { result, rate }
  }

  public formatValue(value: number) {
    return Math.floor(value * 100) / 100
  }
}
