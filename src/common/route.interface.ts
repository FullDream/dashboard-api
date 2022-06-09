import { NextFunction, Response, Request, Router } from 'express'
import { IMiddleware } from './middleware.interface'

export interface RouteController {
	path: string
	func: (req: Request, res: Response, next: NextFunction) => void
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>
	middlewares?: IMiddleware[]
}

export type ExpressReturnType = Response<any, Record<string, any>>
