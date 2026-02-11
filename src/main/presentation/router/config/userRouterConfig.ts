import { DIContainer, SERVICES } from '../../../infra/container'

export interface UserRouterServices {
  authMiddleware: any
  roleMiddleware: any
  ownershipMiddleware: any
  createUserController: any
  getUserByIDController: any
}

export function getUserRouterServices(): UserRouterServices {
  return {
    authMiddleware: DIContainer.get(SERVICES.AUTH_MIDDLEWARE_CONTROLLER),
    roleMiddleware: DIContainer.get(SERVICES.ROLE_MIDDLEWARE_CONTROLLER),
    ownershipMiddleware: DIContainer.get(SERVICES.OWNERSHIP_MIDDLEWARE_CONTROLLER),
    createUserController: DIContainer.get(SERVICES.CREATE_USER_CONTROLLER),
    getUserByIDController: DIContainer.get(SERVICES.GET_USER_CONTROLLER),
  }
}
