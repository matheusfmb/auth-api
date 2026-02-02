import { Router } from "express"
import { CreateUserController, GetUserByIDController, LoginController } from "../controller/user"
import { AuthMiddlewareController } from "../middleware/auth"

class UserRouter {
  private router: Router

  constructor() {
    this.router = Router()
    this.router.post('/users/create', new CreateUserController().createUser)
    this.router.get('/users/:userID', new AuthMiddlewareController().authMiddleware, new GetUserByIDController().getUserByID)
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  UserRouter
}