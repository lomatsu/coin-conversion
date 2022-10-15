import { Request, Response } from "express"

export const errorResponse = (
	message: string,
	error: Error | any | { message: string },
	statusCode: number,
	res: Response,
	debug: (formatter: string, ...args: any[]) => void,
	request?: Request
): void => {
	debug(message, error)
	const origin = request?.header("Origin")?.indexOf(".stg.")
	const host = request?.header("Host")?.indexOf(".stg.")
	const hasOrigin = origin && origin >= 0
	const hasHost = host && host >= 0
	if (!request || (!hasOrigin && !hasHost)) {
		res.status(statusCode).json({ message })
		return
	}
	if (hasOrigin || hasHost) {
		res.status(statusCode).json({
			message,
			stacktrace: error.stack,
		})
		return
	}
}