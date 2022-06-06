import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { ILogger } from '../logger/logger.interface'
import { LoggerService } from '../logger/logger.service'
import { TYPES } from '../types'
import { IExeptionFilter } from './exeption.filter.interface'
import { HTTPError } from './http-error.class'
@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.message}] Ошибка ${err.statusCode} : ${err.message}`)
			res.status(err.statusCode).send({ error: err.message })
		} else {
			this.logger.error(`${err.message}`)
			res.status(500).send({ error: err.message })
		}
	}
}
