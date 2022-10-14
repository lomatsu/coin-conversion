export interface IRepository<T> {
	getPaginated(options: IPageOptions<T>): Promise<{
		data: T[]
		total: number
	}>
	getAll(): Promise<T[]>
	getById(id: number): Promise<T>
	create(data: T): Promise<T>
	update(data: Partial<T>): Promise<T>
	delete(id: number): Promise<boolean>
}

export type PropertiesOfObject<T> = {
	key: keyof T
	value: any
}

export function getQueryFromFilter<T>(
	filter: PropertiesOfObject<T>,
	returnString = true
): string | object {
	return returnString
		? `${String(filter.key)} = ${
				typeof filter.value === "string" ? `'${filter.value}'` : filter.value
		  }`
		: { [String(filter.key)]: filter.value }
}

export interface IPageOptions<T> {
	page: number
	limit: number
	sort?: keyof T
	direction: "asc" | "desc"
	filter?: PropertiesOfObject<T>
}

export interface IPaginationResponse<T> extends IPageOptions<T> {
	data: T[]
	total: number
	hasNext: boolean
}

export interface ICountAnything {
	firstField: any
	secondField: any
}
