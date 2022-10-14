import { UserModel } from "../database/model"

export class UserViewModel {
	id: number
	name: string
	constructor(user: UserModel) {
		this.id = user.id
		this.name = user.name
	}
}
