import { UserEntity } from "../../entities/user"

interface AuthMiddlewareUseCaseRepositoryInterface {
    getRefreshToken(token: string): Promise<string | null>
    saveRefreshToken(token: string): Promise<void>
    deleteRefreshToken(token: string): Promise<void>
    getUserByID(userID: string): Promise<UserEntity | null> 
}

export {
    AuthMiddlewareUseCaseRepositoryInterface
}