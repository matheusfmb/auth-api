import { UserEntity } from "../../entities/user"

interface LoginUserUseCaseRepositoryInterface {
    getUserByEmail(email: string): Promise<UserEntity | null>
    saveRefreshTokenCache(token: string): Promise<void>
}

interface CreateUserUseCaseRepositoryInterface {
    createUser(user: UserEntity): Promise<UserEntity>
}

interface GetUserByIDUseCaseRepositoryInterface {
    getUserByID(userID: string): Promise<UserEntity | null>
}

export {
    LoginUserUseCaseRepositoryInterface,
    CreateUserUseCaseRepositoryInterface,
    GetUserByIDUseCaseRepositoryInterface
}