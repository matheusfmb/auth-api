import { DIContainer, SERVICES } from '../../../infra/container'

export interface AuthRouterServices {
  loginController: any
  logoutController: any
  authMiddleware: any
}

export function getAuthRouterServices(): AuthRouterServices {
  return {
    loginController: DIContainer.get(SERVICES.LOGIN_CONTROLLER),
    logoutController: DIContainer.get(SERVICES.LOGOUT_CONTROLLER),
    authMiddleware: DIContainer.get(SERVICES.AUTH_MIDDLEWARE_CONTROLLER),
  }
}
