import { Router } from "express"
import { CreateUserController, GetUserByIDController } from "../controller/user"
import { AuthMiddlewareController } from "../middleware/auth"
import { RoleMiddlewareController } from "../middleware/role"
import { OwnershipMiddlewareController } from "../middleware/ownership"
import { ALL_ROLES_AUTORIZED } from "../../core/constants/util"

class UserRouter {
  private router: Router

  constructor() {
    this.router = Router()
    this.router.post('/users/create', new CreateUserController().createUser)
    this.router.get('/users/:userID', new AuthMiddlewareController().authMiddleware, new RoleMiddlewareController().requireRoles(ALL_ROLES_AUTORIZED), new OwnershipMiddlewareController().ownershipMiddleware('userID'), new GetUserByIDController().getUserByID)
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  UserRouter
}