import { omit } from "lodash"

export abstract class ModelBase {
	id: number
	created_at?: Date | string
	updated_at?: Date | string
	validationErrorMessages: string[] = []
	public abstract validate(): string[]

	constructor(params: ModelBase) {
		this.id = params.id
		this.created_at = params.created_at
		this.updated_at = params.updated_at
		this.validationErrorMessages = []
	}

	/**
	 * Used to remove function and validationErrorMessage property
	 *
	 * @return {*}  {class who extends ModelBase}
	 * @memberof ModelBase
	 */
	public getDataToSave(): any {
		const data = omit(this, ["validationErrorMessages"])
		return JSON.parse(JSON.stringify(data))
	}
}

export default ModelBase
