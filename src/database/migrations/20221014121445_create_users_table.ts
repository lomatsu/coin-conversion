import { Knex } from "knex";
import { onUpdateTrigger, tableName } from "../helps";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName.USERS, (table) => {
		table.increments("id", { primaryKey: true })
		table.string("name", 255).notNullable()
		table.timestamps(true, true)
	})
	await knex.raw(onUpdateTrigger(tableName.USERS))
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable(tableName.USERS)
}

