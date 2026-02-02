import { EXPIRE_IN_1H, EXPIRE_IN_3H } from "../constants/util"
import { InternalServerError, UnauthorizedError } from "../entities/error"
import { TokenPayloadEntity } from "../entities/token"
import { AuthMiddlewareUseCaseCommonInterface } from "./common/auth"
import { AuthMiddlewareUseCaseRepositoryInterface } from "./repository/auth"
import { AuthMiddlewareUseCaseRequest, AuthMiddlewareUseCaseResponse } from "./ucio/auth"
import { AuthMiddlewareUseCaseValidateInterface } from "./validate/auth"

class AuthMiddlewareUseCase {
    public common: AuthMiddlewareUseCaseCommonInterface
    public validate: AuthMiddlewareUseCaseValidateInterface
    public repository: AuthMiddlewareUseCaseRepositoryInterface

    constructor(common: AuthMiddlewareUseCaseCommonInterface, validate: AuthMiddlewareUseCaseValidateInterface, repository: AuthMiddlewareUseCaseRepositoryInterface) {
        this.common = common
        this.validate = validate
        this.repository = repository
    }

    async authMiddleware(req: AuthMiddlewareUseCaseRequest): Promise<AuthMiddlewareUseCaseResponse> {
        try {
            const validationError = this.validate.authMiddleware(req)
            if (validationError) {
                const errorEntity = this.common.mapValidationErrorToEntity(validationError)
                return new AuthMiddlewareUseCaseResponse(null, null, null, errorEntity)
            }

            const accessPayload = this.common.decodeToken(req.accessToken)

            if (accessPayload) {
                const user = await this.repository.getUserByID(accessPayload.userID)

                if (!user) {
                    return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("User not found"))
                }

                return new AuthMiddlewareUseCaseResponse(user, null, null, null)
            }

            if (!req.refreshToken) {
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Invalid access token"))
            }

            const refreshTokenInCache = await this.repository.getRefreshToken(req.refreshToken)

            if (!refreshTokenInCache) {
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Refresh token is invalid"))
            }

            const refreshPayload = this.common.decodeToken(req.refreshToken)

            if (!refreshPayload) {
                await this.repository.deleteRefreshToken(req.refreshToken)
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Refresh token expired"))
            }

            const user = await this.repository.getUserByID(refreshPayload.userID)
            if (!user) {
                await this.repository.deleteRefreshToken(req.refreshToken)
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("User not found"))
            }

            const now = this.common.newDate()
            const expireAt = this.common.newDate()
            expireAt.setHours(expireAt.getHours() + 1)

            const tokenPayload = new TokenPayloadEntity(user.ID, user.role, expireAt.getTime(), now.getTime())
            const accessToken = this.common.generateToken(tokenPayload, EXPIRE_IN_1H)
            const refreshToken = this.common.generateToken(tokenPayload, EXPIRE_IN_3H)

            await this.repository.deleteRefreshToken(req.refreshToken)
            await this.repository.saveRefreshToken(refreshToken)

            return new AuthMiddlewareUseCaseResponse(user, accessToken, refreshToken, null)

        } catch (error: any) {
            return new AuthMiddlewareUseCaseResponse(null, null, null, new InternalServerError(error.message))
        }
    }
}

export {
    AuthMiddlewareUseCase
}