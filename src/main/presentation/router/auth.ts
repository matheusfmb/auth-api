import { Router } from "express"
import { LoginController, LogoutController } from "../controller/user"
import { AuthMiddlewareController } from "../middleware/auth"

class AuthRouter {
  private router: Router

  constructor() {
    this.router = Router()

    this.router.post('/auth/login', new LoginController().login)
    this.router.post('/auth/logout', new AuthMiddlewareController().authMiddleware, new LogoutController().logout)
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  AuthRouter
}