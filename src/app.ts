import express, { Express } from 'express'
import { Server } from 'http'
import { ExeptionFilter } from './errors/exeption.filter'
import { LoggerService } from './logger/logger.service'
import { UserController } from './users/user.controller'

export class App {
	app: Express
	// @ts-ignore
	server: Server
	port: number
	logger: LoggerService
	userController: UserController
	exeptionFilter: ExeptionFilter

	constructor(logger: LoggerService, userController: UserController, exeptionFilter: ExeptionFilter) {
		this.app = express()
		this.port = 8000
		this.logger = logger
		this.userController = userController
		this.exeptionFilter = exeptionFilter
	}

	useRoutes() {
		this.app.use('/users', this.userController.router)
	}
	useExeptionFilter() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
	}

	public async init() {
		this.useRoutes()
		this.server = this.app.listen(this.port)
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
	}
}
