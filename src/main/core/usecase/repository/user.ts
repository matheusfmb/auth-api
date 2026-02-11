import { UserEntity } from "../../entities/user"

interface LoginUserUseCaseRepositoryInterface {
    getUserByEmail(email: string): Promise<UserEntity | null>
    saveRefreshTokenCache(token: string, userID: string, version: number): Promise<void>
}

interface CreateUserUseCaseRepositoryInterface {
    createUser(user: UserEntity): Promise<UserEntity>
}

interface GetUserByIDUseCaseRepositoryInterface {
    getUserByID(userID: string): Promise<UserEntity | null>
}

interface LogoutUserUseCaseRepositoryInterface {
    addTokenToBlacklist(jti: string): Promise<void>
    deleteRefreshToken(userID: string): Promise<void>
}

export {
    LoginUserUseCaseRepositoryInterface,
    CreateUserUseCaseRepositoryInterface,
    GetUserByIDUseCaseRepositoryInterface,
    LogoutUserUseCaseRepositoryInterface
}