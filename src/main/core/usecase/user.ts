import { EXPIRE_IN_1H, EXPIRE_IN_24H } from "../constants/util"
import { InternalServerError, NotFoundError, PreconditionError, TAG_PRE_CONDITION_ERROR, UnauthorizedError } from "../entities/error"
import { TokenPayloadEntity } from "../entities/token"
import { UserEntity } from "../entities/user"
import { CreateUserUseCaseCommonInterface, GetUserByIDUseCaseCommonInterface, LoginUserUseCaseCommonInterface, LogoutUserUseCaseCommonInterface } from "./common/user"
import { CreateUserUseCaseRepositoryInterface, GetUserByIDUseCaseRepositoryInterface, LoginUserUseCaseRepositoryInterface, LogoutUserUseCaseRepositoryInterface } from "./repository/user"
import { CreateUserUseCaseRequest, CreateUserUseCaseResponse, GetUserByIDUseCaseRequest, GetUserByIDUseCaseResponse, LoginUserUseCaseRequest, LoginUserUseCaseResponse, LogoutUserUseCaseRequest, LogoutUserUseCaseResponse } from "./ucio/user"
import { CreateUserUseCaseValidateInterface, GetUserByIDUseCaseValidateInterface, LoginUserUseCaseValidateInterface, LogoutUserUseCaseValidateInterface } from "./validate/user"

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
      
      const sharedJti = this.common.generateUUID()
      const tokenPayload = new TokenPayloadEntity(user.ID, user.role, expireAt.getTime(), now.getTime(), sharedJti, 1)

      const accessToken = this.common.generateToken(tokenPayload, EXPIRE_IN_1H)
      const refreshToken = this.common.generateToken(tokenPayload, EXPIRE_IN_24H)

      await this.repository.saveRefreshTokenCache(refreshToken, user.ID, 1)

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

class GetUserByIDUseCase {
  public common: GetUserByIDUseCaseCommonInterface
  public repository: GetUserByIDUseCaseRepositoryInterface
  public validate: GetUserByIDUseCaseValidateInterface

  constructor(common: GetUserByIDUseCaseCommonInterface, repository: GetUserByIDUseCaseRepositoryInterface, validate: GetUserByIDUseCaseValidateInterface) {
      this.common = common
      this.repository = repository
      this.validate = validate
  } 

  async getUserByID(req: GetUserByIDUseCaseRequest): Promise<GetUserByIDUseCaseResponse> {
    try {

      const validationError = this.validate.getUserByIDByID(req)

      if (validationError) {
        console.log(TAG_PRE_CONDITION_ERROR, validationError.message)
        const errorEntity = this.common.mapValidationErrorToEntity(validationError)
        return new GetUserByIDUseCaseResponse(null, errorEntity)
      }
      const user = await this.repository.getUserByID(req.userID)

      if(user && user.ID){
        return new GetUserByIDUseCaseResponse(user, null)
      } else {
        return new GetUserByIDUseCaseResponse(user, new NotFoundError("User not found"))
      }
    } catch(error: any) {
      console.log(TAG_PRE_CONDITION_ERROR, error)
      return new GetUserByIDUseCaseResponse(null, new InternalServerError(error.message))
    } 
  }
}

class LogoutUserUseCase {
  constructor(
    public common: LogoutUserUseCaseCommonInterface,
    public repository: LogoutUserUseCaseRepositoryInterface,
    public validate: LogoutUserUseCaseValidateInterface
  ) {}

  async logout(req: LogoutUserUseCaseRequest): Promise<LogoutUserUseCaseResponse> {
    try {
      const validationError = this.validate.logout(req)

      if (validationError) {
        const errorEntity = this.common.mapValidationErrorToEntity(validationError)
        return new LogoutUserUseCaseResponse(false, errorEntity)
      }

      const accessPayload = this.common.decodeToken(req.accessToken)
      if(!accessPayload?.jti) {
        return new LogoutUserUseCaseResponse(false, new PreconditionError("JWT ID not found in access token"))
      }

      await this.repository.addTokenToBlacklist(accessPayload.jti)

      if (req.refreshToken) {
        const refreshPayload = this.common.decodeToken(req.refreshToken)
        if (refreshPayload?.jti) {
          await this.repository.addTokenToBlacklist(refreshPayload.jti)
        }
      }

      await this.repository.deleteRefreshToken(req.userID)

      return new LogoutUserUseCaseResponse(true, null)
    } catch (error: any) {
      return new LogoutUserUseCaseResponse(false, new InternalServerError(error.message))
    }
  }
}

export {
    LoginUserUseCase,
    CreateUserUseCase,
    GetUserByIDUseCase,
    LogoutUserUseCase
}