import { Router } from "express"
import { LoginController } from "../controller/user"

class AuthRouter {
  private router: Router

  constructor() {
    this.router = Router()

    this.router.post('/auth/login', new LoginController().login)
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  AuthRouter
}