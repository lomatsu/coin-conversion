import { Knex } from "knex"
import { tableName } from "../helps"

export async function seed(knex: Knex): Promise<void> {
	try {
		const data = await knex<any>(tableName.USERS).select("*").first()
		if (data) {
			console.log("Skipping seed table ", tableName.USERS)
			return
		}
		// Inserts seed entries
		await knex<any>(tableName.USERS).insert([
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
