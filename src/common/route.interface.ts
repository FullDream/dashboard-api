import { NextFunction, Response, Request, Router } from 'express'

export interface RouteController {
	path: string
	func: (req: Request, res: Response, next: NextFunction) => void
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>
}