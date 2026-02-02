import { UserEntity } from "../../entities/user"

interface LoginUserUseCaseRepositoryInterface {
    getUserByEmail(email: string): Promise<UserEntity | null>
    saveRefreshTokenCache(token: string): Promise<void>
}

interface CreateUserUseCaseRepositoryInterface {
    createUser(user: UserEntity): Promise<UserEntity>
}

export {
    LoginUserUseCaseRepositoryInterface,
    CreateUserUseCaseRepositoryInterface
}