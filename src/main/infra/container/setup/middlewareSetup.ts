import { RoleMiddlewareUseCase } from '../../../core/usecase/role'
import { RoleMiddlewareController } from '../../../presentation/middleware/role'
import { RoleMiddlewareUseCaseCommon } from '../../provider/common/role'
import { RoleMiddlewareUseCaseValidate } from '../../provider/validate/role'
import { DIContainer } from '../DIContainer'
import { SERVICES } from '../DIBootstrap'

export function setupMiddlewareServices(): void {
  DIContainer.registerSingleton(SERVICES.ROLE_MIDDLEWARE_COMMON, () => {
    return new RoleMiddlewareUseCaseCommon()
  })

  DIContainer.registerSingleton(SERVICES.ROLE_MIDDLEWARE_VALIDATE, () => {
    return new RoleMiddlewareUseCaseValidate()
  })

  DIContainer.registerSingleton(SERVICES.ROLE_MIDDLEWARE_USECASE, () => {
    const common = DIContainer.get(SERVICES.ROLE_MIDDLEWARE_COMMON)
    const validate = DIContainer.get(SERVICES.ROLE_MIDDLEWARE_VALIDATE)
    return new RoleMiddlewareUseCase(common, validate)
  })

  DIContainer.registerSingleton(SERVICES.ROLE_MIDDLEWARE_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.ROLE_MIDDLEWARE_USECASE)
    return new RoleMiddlewareController(usecase)
  })
}
