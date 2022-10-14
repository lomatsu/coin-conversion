import { TransactionViewModel } from "../../transaction/TransactionViewModel"
import { ModelBase } from "./Base"

export class TransactionModel extends ModelBase {
	user_id: number
  origin_currency: string
	origin_value: number
  target_currency: string
  conversion_rate: number
  validationErrorMessages: string[] = []
  

	constructor(params: TransactionViewModel) {
		super(params as any)
		this.user_id = params.userId
    this.origin_currency = params.originCurrency
    this.origin_value = params.originValue
    this.target_currency = params.targetCurrency
    this.conversion_rate = params.conversionRate

	}

	public validate(): string[] {
    if (!this.user_id) {
			this.validationErrorMessages.push("Property user_id is required")
		}
		if (!this.origin_currency) {
			this.validationErrorMessages.push("Property origin_currency is required")
		}
    if (!this.origin_value) {
			this.validationErrorMessages.push("Property origin_value is required")
		}
    if (!this.target_currency) {
			this.validationErrorMessages.push("Property target_currency is required")
		}
		return this.validationErrorMessages
	}
}

export default TransactionModel