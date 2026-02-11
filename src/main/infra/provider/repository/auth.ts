import { UserEntity } from "../../../core/entities/user"
import { AuthMiddlewareUseCaseRepositoryInterface } from "../../../core/usecase/repository/auth"
import { getUserByID } from "../../internal/database/postgresql/user"
import { deleteRefreshToken, getRefreshToken, saveRefreshToken, isJtiBlacklisted, addJtiToBlacklist } from "../../internal/database/redis/user"

class AuthMiddlewareUseCaseRepository implements AuthMiddlewareUseCaseRepositoryInterface {
    async getRefreshToken(userID: string): Promise<{ token: string; version: number } | null> {
        return getRefreshToken(userID)
    }
    async saveRefreshToken(token: string, userID: string, version: number): Promise<void> {
        return saveRefreshToken(token, userID, version)
    }
    async deleteRefreshToken(userID: string): Promise<void> {
        return deleteRefreshToken(userID)
    }
    async isTokenBlacklisted(jti: string): Promise<boolean> {
        return isJtiBlacklisted(jti)
    }
    async addTokenToBlacklist(jti: string): Promise<void> {
        return addJtiToBlacklist(jti)
    }
    async getUserByID(userID: string): Promise<UserEntity | null> {
        return getUserByID(userID)
    }
}

export {
    AuthMiddlewareUseCaseRepository
}