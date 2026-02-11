import { UserEntity } from "../../entities/user"

interface AuthMiddlewareUseCaseRepositoryInterface {
    getRefreshToken(userID: string): Promise<{ token: string; version: number } | null>
    saveRefreshToken(token: string, userID: string, version: number): Promise<void>
    deleteRefreshToken(userID: string): Promise<void>
    isTokenBlacklisted(jti: string): Promise<boolean>
    addTokenToBlacklist(jti: string): Promise<void>
    getUserByID(userID: string): Promise<UserEntity | null> 
}

export {
    AuthMiddlewareUseCaseRepositoryInterface
}