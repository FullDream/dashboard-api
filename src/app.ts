import { json } from 'body-parser'
import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { AuthMiddleware } from './common/auth.middleware'

import { IConfigService } from './config/config.service.interface'
import { PrismaService } from './database/prisma.service'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { ILogger } from './logger/logger.interface'
import { TYPES } from './types'
import { UserController } from './users/user.controller'

@injectable()
export class App {
	app: Express
	server: Server
	port: number

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express()
		this.server = new Server()
		this.port = 8000
	}
	useMiddleware(): void {
		this.app.use(json())

		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'))
		this.app.use(authMiddleware.execute.bind(authMiddleware))
	}
	useRoutes(): void {
		this.app.use('/users', this.userController.router)
	}
	useExeptionFilter(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
	}

	public async init(): Promise<void> {
		this.useMiddleware()
		this.useRoutes()
		await this.prismaService.connect()
		this.server = this.app.listen(this.port)
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
	}
}
