import { Router } from "express"
import { CreateUserController, LoginController } from "../controller/user"

class UserRouter {
  private router: Router

  constructor() {
    this.router = Router()
    this.router.post('/users/create', new CreateUserController().createUser)
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  UserRouter
}