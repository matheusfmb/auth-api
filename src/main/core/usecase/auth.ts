import { EXPIRE_IN_1H, EXPIRE_IN_24H } from "../constants/util"
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
                const isJtiBlacklisted = await this.repository.isTokenBlacklisted(accessPayload.jti)
                if (isJtiBlacklisted) {
                    return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Token has been revoked"))
                }

                const user = await this.repository.getUserByID(accessPayload.userID)

                if (!user) {
                    return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("User not found"))
                }

                return new AuthMiddlewareUseCaseResponse(user, null, null, null)
            }

            if (!req.refreshToken) {
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Invalid access token"))
            }

            const refreshPayload = this.common.decodeToken(req.refreshToken)

            if (!refreshPayload) {
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Refresh token expired"))
            }

            const isRefreshJtiBlacklisted = await this.repository.isTokenBlacklisted(refreshPayload.jti)
            if (isRefreshJtiBlacklisted) {
                await this.repository.deleteRefreshToken(refreshPayload.userID)
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Refresh token has been revoked"))
            }

            const refreshTokenData = await this.repository.getRefreshToken(refreshPayload.userID)

            if (!refreshTokenData) {
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Refresh token is invalid"))
            }

            const tokenVersion = refreshPayload.version || 1
            if (tokenVersion !== refreshTokenData.version) {
                await this.repository.deleteRefreshToken(refreshPayload.userID)
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("Suspicious activity detected. Please login again"))
            }

            const user = await this.repository.getUserByID(refreshPayload.userID)
            if (!user) {
                await this.repository.deleteRefreshToken(refreshPayload.userID)
                return new AuthMiddlewareUseCaseResponse(null, null, null, new UnauthorizedError("User not found"))
            }

            const now = this.common.newDate()
            const expireAt = this.common.newDate()
            expireAt.setHours(expireAt.getHours() + 1)

            const tokenPayload = new TokenPayloadEntity(user.ID, user.role, expireAt.getTime(), now.getTime())
            const newAccessToken = this.common.generateToken(tokenPayload, EXPIRE_IN_1H)
            
            const newVersion = (tokenVersion || 1) + 1
            const newRefreshToken = this.common.generateToken(tokenPayload, EXPIRE_IN_24H)
            
            await this.repository.saveRefreshToken(newRefreshToken, user.ID, newVersion)

            return new AuthMiddlewareUseCaseResponse(user, newAccessToken, newRefreshToken, null)

        } catch (error: any) {
            return new AuthMiddlewareUseCaseResponse(null, null, null, new InternalServerError(error.message))
        }
    }
}

export {
    AuthMiddlewareUseCase
}