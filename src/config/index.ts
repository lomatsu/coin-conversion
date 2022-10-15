export const PORT = process.env.PORT
export const DB_HOST = process.env.DB_HOST
export const DB_NAME = process.env.POSTGRES_DB
export const DB_USER = process.env.POSTGRES_USER
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD
export const JWT_SECRET = process.env.JWT_SECRET as string
export * from "./knexfile"
