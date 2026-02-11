import { AuthMiddlewareUseCase } from '../../../core/usecase/auth'
import { OwnerShipMiddlwareUseCase } from '../../../core/usecase/ownership'
import { AuthMiddlewareController } from '../../../presentation/middleware/auth'
import { OwnershipMiddlewareController } from '../../../presentation/middleware/ownership'
import { AuthMiddlewareUseCaseCommon } from '../../provider/common/auth'
import { AuthMiddlewareUseCaseRepository } from '../../provider/repository/auth'
import { AuthMiddlewareUseCaseValidate } from '../../provider/validate/auth'
import { DIContainer } from '../DIContainer'
import { SERVICES } from '../DIBootstrap'

export function setupAuthServices(): void {
  // ===== Auth Middleware =====
  DIContainer.registerSingleton(SERVICES.AUTH_MIDDLEWARE_COMMON, () => {
    return new AuthMiddlewareUseCaseCommon()
  })

  DIContainer.registerSingleton(SERVICES.AUTH_MIDDLEWARE_VALIDATE, () => {
    return new AuthMiddlewareUseCaseValidate()
  })

  DIContainer.registerSingleton(SERVICES.AUTH_MIDDLEWARE_REPOSITORY, () => {
    return new AuthMiddlewareUseCaseRepository()
  })

  DIContainer.registerSingleton(SERVICES.AUTH_MIDDLEWARE_USECASE, () => {
    const common = DIContainer.get(SERVICES.AUTH_MIDDLEWARE_COMMON)
    const validate = DIContainer.get(SERVICES.AUTH_MIDDLEWARE_VALIDATE)
    const repository = DIContainer.get(SERVICES.AUTH_MIDDLEWARE_REPOSITORY)
    return new AuthMiddlewareUseCase(common, validate, repository)
  })

  DIContainer.registerSingleton(SERVICES.AUTH_MIDDLEWARE_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.AUTH_MIDDLEWARE_USECASE)
    return new AuthMiddlewareController(usecase)
  })

  // ===== Ownership Middleware =====
  DIContainer.registerSingleton(SERVICES.OWNERSHIP_MIDDLEWARE_USECASE, () => {
    return new OwnerShipMiddlwareUseCase()
  })

  DIContainer.registerSingleton(SERVICES.OWNERSHIP_MIDDLEWARE_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.OWNERSHIP_MIDDLEWARE_USECASE)
    return new OwnershipMiddlewareController(usecase)
  })
}
