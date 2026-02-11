import { Router } from "express"
import { ALL_ROLES_AUTORIZED } from "../../core/constants/util"
import { UserRouterServices } from "./config/userRouterConfig"

class UserRouter {
  private router: Router

  constructor(services: UserRouterServices) {
    this.router = Router()


    this.router.post('/users/create', (req, res) => services.createUserController.createUser(req, res))
    this.router.get('/users/:userID', (req, res, next) => services.authMiddleware.authMiddleware(req, res, next), (req, res, next) => services.roleMiddleware.requireRoles(ALL_ROLES_AUTORIZED)(req, res, next), 
      (req, res, next) => services.ownershipMiddleware.ownershipMiddleware('userID')(req, res, next),
      (req, res) => services.getUserByIDController.getUserByID(req, res)
    )
  }

  public getRouter(): Router {
    return this.router
  }
}

export {
  UserRouter
}