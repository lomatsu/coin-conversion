import { TransactionModel } from "../database/model"

export class TransactionViewModel {
	id: number
	userId: number
  originCurrency: string
	originValue: number
  targetCurrency: string
  conversionRate: number

	constructor(transaction: TransactionModel) {
		this.id = transaction.id
		this.userId = transaction.user_id
    this.originCurrency = transaction.origin_currency
    this.originValue = transaction.origin_value
    this.targetCurrency = transaction.target_currency
    this.conversionRate = transaction.conversion_rate
	}
}