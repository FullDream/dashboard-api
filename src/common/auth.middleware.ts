import { verify } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from './middleware.interface'

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next()
				} else if (payload) {
					// @ts-ignore
					req.user = payload.email
					next()
				}
			})
		} else {
			next()
		}
	}
}
