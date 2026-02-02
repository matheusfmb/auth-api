import { EXPIRE_IN_1H, EXPIRE_IN_3H } from "../constants/util"
import { InternalServerError, TAG_PRE_CONDITION_ERROR, UnauthorizedError } from "../entities/error"
import { TokenPayloadEntity } from "../entities/token"
import { UserEntity } from "../entities/user"
import { CreateUserUseCaseCommonInterface, LoginUserUseCaseCommonInterface } from "./common/user"
import { CreateUserUseCaseRepositoryInterface, LoginUserUseCaseRepositoryInterface } from "./repository/user"
import { CreateUserUseCaseRequest, CreateUserUseCaseResponse, LoginUserUseCaseRequest, LoginUserUseCaseResponse } from "./ucio/user"
import { CreateUserUseCaseValidateInterface, LoginUserUseCaseValidateInterface } from "./validate/user"


class LoginUserUseCase {
  constructor(
    public common: LoginUserUseCaseCommonInterface,
    public repository: LoginUserUseCaseRepositoryInterface,
    public validate: LoginUserUseCaseValidateInterface
  ) {}

  async login(req: LoginUserUseCaseRequest): Promise<LoginUserUseCaseResponse> {
    try {
      const validationError = this.validate.login(req)

      if (validationError) {
        const errorEntity = this.common.mapValidationErrorToEntity(validationError)
        return new LoginUserUseCaseResponse(null, null, errorEntity)
      }

      const user = await this.repository.getUserByEmail(req.email)

      if (!user) { 
        return new LoginUserUseCaseResponse(null, null, new UnauthorizedError("Invalid credentials"))
      }

      const passwordValid = await this.common.comparePassword(req.password, user.password)

      if (!passwordValid) {
        return new LoginUserUseCaseResponse(null, null, new UnauthorizedError("Invalid credentials"))
      }

      const now = this.common.newDate()
      const expireAt = this.common.newDate()
      expireAt.setHours(expireAt.getHours() + 1)

      const tokenPayload = new TokenPayloadEntity(user.ID, user.role, expireAt.getTime(), now.getTime())

      const accessToken = this.common.generateToken(tokenPayload, EXPIRE_IN_1H)
      const refreshToken = this.common.generateToken(tokenPayload, EXPIRE_IN_3H)

      await this.repository.saveRefreshTokenCache(refreshToken)

      return new LoginUserUseCaseResponse(accessToken, refreshToken, null)

    } catch (error: any) {
        return new LoginUserUseCaseResponse(null, null, new InternalServerError(error.message))
    }
  }
}



class CreateUserUseCase {
    public common: CreateUserUseCaseCommonInterface
    public repository: CreateUserUseCaseRepositoryInterface
    public validate: CreateUserUseCaseValidateInterface

    constructor(common: CreateUserUseCaseCommonInterface, repository: CreateUserUseCaseRepositoryInterface, validate: CreateUserUseCaseValidateInterface) {
        this.common = common
        this.repository = repository
        this.validate = validate
    }

    async createUser(req: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
        try {
            const validationError = await this.validate.createUser(req)

            if (validationError) {
              console.log(TAG_PRE_CONDITION_ERROR, validationError.message)
              const errorEntity = this.common.mapValidationErrorToEntity(validationError)
              return new CreateUserUseCaseResponse(null, errorEntity)
            }
            
            const now = this.common.newDate()
            const uuid = this.common.generateUUID()
            const hashed =  await this.common.hashPassword(req.password)
            const entity = new UserEntity(uuid, req.name, req.email, hashed, req.role, now, now)
            
            const userCreated = await this.repository.createUser(entity)

            return new CreateUserUseCaseResponse(userCreated, null)
        } catch (error: any) {
            console.log(TAG_PRE_CONDITION_ERROR, error)
            return new CreateUserUseCaseResponse(null, new InternalServerError(error.message))
        }
    }
}

export {
    LoginUserUseCase,
    CreateUserUseCase
}