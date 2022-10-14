import { Knex } from "knex";
import { createForeignName, onUpdateTrigger, tableName } from "../helps";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName.TRANSACTIONS, (table) => {
		table.increments("id", { primaryKey: true })
		table.integer("user_id").nullable()
		table.string("origin_currency", 3).notNullable()
		table.float("origin_value").notNullable()
		table.string("target_currency", 3).notNullable()
		table.float("conversion_rate").notNullable()
		table.timestamps(true, true)
		table
			.foreign(
				"user_id",
				createForeignName(tableName.TRANSACTIONS, tableName.USERS)
			)
			.references("id")
			.inTable(tableName.USERS)
	})
	await knex.raw(onUpdateTrigger(tableName.TRANSACTIONS))
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable(tableName.TRANSACTIONS)
}

