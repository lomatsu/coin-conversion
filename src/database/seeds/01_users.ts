import { Knex } from "knex"
import { tableName } from "../helps"
import { UserModel } from "../model"

export async function seed(knex: Knex): Promise<void> {
	try {
		const data = await knex<UserModel>(tableName.USERS).select("*").first()
		if (data) {
			console.log("Skipping seed table ", tableName.USERS)
			return
		}
		// Inserts seed entries
		await knex<UserModel>(tableName.USERS).insert([
			{
				name: "Lauro Omatsu",
			},
			{
				name: "João da Silva",
			},
			{
				name: "José de Souza",
			},
		])
	} catch (error: any) {
		console.log("Error on seed ", tableName.USERS, error.message)
	}
}
