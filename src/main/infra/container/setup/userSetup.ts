import { LoginUserUseCase, CreateUserUseCase, GetUserByIDUseCase, LogoutUserUseCase } from '../../../core/usecase/user'
import { LoginUserUseCaseValidate, CreateUserUseCaseValidate, GetUserByIDUseCaseValidate, LogoutUserUseCaseValidate } from '../../provider/validate/user'
import { LoginUserUseCaseRepository, CreateUserUseCaseRepository, GetUserByIDUseCaseRepository, LogoutUserUseCaseRepository } from '../../provider/repository/user'
import { LoginController, CreateUserController, GetUserByIDController, LogoutController } from '../../../presentation/controller/user'
import { LoginUserUseCaseCommon, CreateUserUseCaseCommon, GetUserByIDUseCaseCommon, LogoutUserUseCaseCommon } from '../../provider/common/user'
import { DIContainer } from '../DIContainer'
import { SERVICES } from '../DIBootstrap'

export function setupUserServices(): void {
  // ===== Login =====
  DIContainer.registerSingleton(SERVICES.LOGIN_COMMON, () => {
    return new LoginUserUseCaseCommon()
  })

  DIContainer.registerSingleton(SERVICES.LOGIN_VALIDATE, () => {
    return new LoginUserUseCaseValidate()
  })

  DIContainer.registerSingleton(SERVICES.LOGIN_REPOSITORY, () => {
    return new LoginUserUseCaseRepository()
  })

  DIContainer.registerSingleton(SERVICES.LOGIN_USECASE, () => {
    const common = DIContainer.get(SERVICES.LOGIN_COMMON)
    const validate = DIContainer.get(SERVICES.LOGIN_VALIDATE)
    const repository = DIContainer.get(SERVICES.LOGIN_REPOSITORY)
    return new LoginUserUseCase(common, repository, validate)
  })

  DIContainer.registerSingleton(SERVICES.LOGIN_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.LOGIN_USECASE)
    return new LoginController(usecase)
  })

  // ===== Create User =====
  DIContainer.registerSingleton(SERVICES.CREATE_USER_COMMON, () => {
    return new CreateUserUseCaseCommon()
  })

  DIContainer.registerSingleton(SERVICES.CREATE_USER_VALIDATE, () => {
    return new CreateUserUseCaseValidate()
  })

  DIContainer.registerSingleton(SERVICES.CREATE_USER_REPOSITORY, () => {
    return new CreateUserUseCaseRepository()
  })

  DIContainer.registerSingleton(SERVICES.CREATE_USER_USECASE, () => {
    const common = DIContainer.get(SERVICES.CREATE_USER_COMMON)
    const validate = DIContainer.get(SERVICES.CREATE_USER_VALIDATE)
    const repository = DIContainer.get(SERVICES.CREATE_USER_REPOSITORY)
    return new CreateUserUseCase(common, repository, validate)
  })

  DIContainer.registerSingleton(SERVICES.CREATE_USER_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.CREATE_USER_USECASE)
    return new CreateUserController(usecase)
  })

  // ===== Get User By ID =====
  DIContainer.registerSingleton(SERVICES.GET_USER_COMMON, () => {
    return new GetUserByIDUseCaseCommon()
  })

  DIContainer.registerSingleton(SERVICES.GET_USER_VALIDATE, () => {
    return new GetUserByIDUseCaseValidate()
  })

  DIContainer.registerSingleton(SERVICES.GET_USER_REPOSITORY, () => {
    return new GetUserByIDUseCaseRepository()
  })

  DIContainer.registerSingleton(SERVICES.GET_USER_USECASE, () => {
    const common = DIContainer.get(SERVICES.GET_USER_COMMON)
    const validate = DIContainer.get(SERVICES.GET_USER_VALIDATE)
    const repository = DIContainer.get(SERVICES.GET_USER_REPOSITORY)
    return new GetUserByIDUseCase(common, repository, validate)
  })

  DIContainer.registerSingleton(SERVICES.GET_USER_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.GET_USER_USECASE)
    return new GetUserByIDController(usecase)
  })

  // ===== Logout =====
  DIContainer.registerSingleton(SERVICES.LOGOUT_COMMON, () => {
    return new LogoutUserUseCaseCommon()
  })

  DIContainer.registerSingleton(SERVICES.LOGOUT_VALIDATE, () => {
    return new LogoutUserUseCaseValidate()
  })

  DIContainer.registerSingleton(SERVICES.LOGOUT_REPOSITORY, () => {
    return new LogoutUserUseCaseRepository()
  })

  DIContainer.registerSingleton(SERVICES.LOGOUT_USECASE, () => {
    const common = DIContainer.get(SERVICES.LOGOUT_COMMON)
    const validate = DIContainer.get(SERVICES.LOGOUT_VALIDATE)
    const repository = DIContainer.get(SERVICES.LOGOUT_REPOSITORY)
    return new LogoutUserUseCase(common, repository, validate)
  })

  DIContainer.registerSingleton(SERVICES.LOGOUT_CONTROLLER, () => {
    const usecase = DIContainer.get(SERVICES.LOGOUT_USECASE)
    return new LogoutController(usecase)
  })
}
