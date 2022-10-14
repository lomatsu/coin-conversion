import { UserViewModel } from "../../user/UserViewModel"
import { ModelBase } from "./Base"

export class UserModel extends ModelBase {
	name: string
  validationErrorMessages: string[] = []
  

	constructor(params: UserViewModel & { password: string }) {
		super(params as any)
		this.name = params.name
	}

	public validate(): string[] {
		if (!this.name) {
			this.validationErrorMessages.push("Property name is required")
		}
		return this.validationErrorMessages
	}
}

export default UserModel
