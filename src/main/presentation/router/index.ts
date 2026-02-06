import express from 'express'
import { CorsRouter } from './cors'
import { UserRouter } from './user'
import { AuthRouter } from './auth'
import { limiter } from '../middleware/rateLimiter'

class Router {
	constructor(app: express.Router) {
		app.use(limiter)
		app.use(new CorsRouter().getRouter())
		app.use(new UserRouter().getRouter())
		app.use(new AuthRouter().getRouter())
	}
}

export { Router }
