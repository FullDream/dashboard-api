import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { ExeptionFilter } from './errors/exeption.filter'
import { ILogger } from './logger/logger.interface'
import { TYPES } from './types'
import { UserController } from './users/users.controller'

@injectable()
export class App {
	app: Express
	server: Server
	port: number

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express()
		this.server = new Server()
		this.port = 8000
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router)
	}
	useExeptionFilter(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
	}

	public async init(): Promise<void> {
		this.useRoutes()
		this.server = this.app.listen(this.port)
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
	}
}
