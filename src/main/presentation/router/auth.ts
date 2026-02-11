import { Router } from "express"
import { AuthRouterServices } from "./config/authRouterConfig"

class AuthRouter {
  private router: Router

  constructor(services: AuthRouterServices) {
    this.router = Router()
    const { loginController, logoutController, authMiddleware } = services

    this.router.post('/auth/login', (req, res) => loginController.login(req, res))
    this.router.post(
      '/auth/logout',
      (req, res, next) => authMiddleware.authMiddleware(req, res, next),
      (req, res) => logoutController.logout(req, res)
    )
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  AuthRouter
}