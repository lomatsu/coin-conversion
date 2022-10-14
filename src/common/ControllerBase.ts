import { Application, Request, Response } from "express"

export interface IControllerBase {
	getById(req: Request, res: Response): void
	getAll(req: Request, res: Response): void
	save(req: Request, res: Response): void
	update(req: Request, res: Response): void
	delete(req: Request, res: Response): void
	registerRoutes(): void
}

export abstract class ControllerBase<R> implements IControllerBase {
	constructor(protected app: Application, protected repository: R) {}
	public abstract getById(req: Request, res: Response): void
	public abstract getAll(req: Request, res: Response): void
	public abstract save(req: Request, res: Response): void
	public abstract update(req: Request, res: Response): void
	public abstract delete(req: Request, res: Response): void
	public abstract registerRoutes(): void
}