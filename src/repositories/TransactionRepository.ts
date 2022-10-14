import { Knex } from "knex"
import { tableName } from "../database/helps"
import { TransactionModel } from "../database/model"
import { getQueryFromFilter, IPageOptions, IRepository } from "./Repository"

export interface ITransactionRepository extends IRepository<TransactionModel> {
	count(): Promise<number>
}

export class TransactionRepository implements ITransactionRepository {
	constructor(private db: Knex) {}
	count(): Promise<number> {
		return this.db
			.count("*")
			.from(tableName.TRANSACTIONS)
			.then((d: any[]) => Number(d[0].count) as number)
	}
	getAll(): Promise<TransactionModel[]> {
		return this.db.from(tableName.TRANSACTIONS).select("*")
	}
	async getPaginated(options: IPageOptions<TransactionModel>): Promise<{
		data: TransactionModel[]
		total: number
	}> {
		const data = await this.db
			.select<TransactionModel[]>("*")
			.from(tableName.TRANSACTIONS)
			.whereRaw(
				options.filter
					? (getQueryFromFilter(options.filter) as string)
					: "id is not null"
			)
			.orderBy(`${tableName.TRANSACTIONS}.${options.sort}`, options.direction)
			.limit(options.limit)
			.offset(options.page * options.limit)
		let total = 0
		if (!options.filter) {
			total = await this.count()
			return {
				data,
				total,
			}
		}
		total = await this.db
			.count("*")
			.from(tableName.TRANSACTIONS)
			.where(getQueryFromFilter(options.filter, false))
			.then((d: any[]) => Number(d[0].count) as number)
		return {
			data,
			total,
		}
	}
	getById(id: number): Promise<TransactionModel> {
		return this.db.select("*").from(tableName.TRANSACTIONS).where("id", id).first()
	}
	async create(data: TransactionModel): Promise<TransactionModel> {
		return this.db
			.insert(data.getDataToSave(), "*")
			.into(tableName.TRANSACTIONS)
			.then((d) => d[0])
	}
	update(data: Partial<TransactionModel>): Promise<TransactionModel> {
		if (!data.getDataToSave) {
			throw new Error(
				"Incomplete implementation model. Missing [getDataToSave] function"
			)
		}
		return this.db
			.update(data.getDataToSave(), "*")
			.into(tableName.TRANSACTIONS)
			.where("id", data.id)
			.then((d) => d[0])
	}
	delete(id: number): Promise<boolean> {
		return this.db.from(tableName.TRANSACTIONS).where("id", id).delete()
	}
}