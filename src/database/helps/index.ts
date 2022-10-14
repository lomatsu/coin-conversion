export function onUpdateTrigger(tableName: string): string {
	return `
    CREATE TRIGGER ${tableName}_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `
}

export const tableName = {
	USERS: "users",
	TRANSACTIONS: "transactions",
}

export function createForeignName(tableLeft: string, tableRight: string) {
	return `${tableLeft}_${tableRight}`
}
