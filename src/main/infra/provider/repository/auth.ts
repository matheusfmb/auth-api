import { UserEntity } from "../../../core/entities/user"
import { AuthMiddlewareUseCaseRepositoryInterface } from "../../../core/usecase/repository/auth"
import { getUserByID } from "../../internal/database/postgresql/user"
import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from "../../internal/database/redis/user"

class AuthMiddlewareUseCaseRepository implements AuthMiddlewareUseCaseRepositoryInterface {
    async getRefreshToken(token: string): Promise<string | null> {
        return getRefreshToken(token)
    }
    async saveRefreshToken(token: string): Promise<void> {
        return saveRefreshToken(token)
    }
    async deleteRefreshToken(token: string): Promise<void> {
        return deleteRefreshToken(token)
    }
    async getUserByID(userID: string): Promise<UserEntity | null> {
        return getUserByID(userID)
    }
}

export {
    AuthMiddlewareUseCaseRepository
}