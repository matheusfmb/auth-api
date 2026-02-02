import { UserEntity } from "../../entities/user"

interface LoginUserUseCaseRepositoryInterface {
    login(email: string, password: string): Promise<UserEntity>
}

interface CreateUserUseCaseRepositoryInterface {
    createUser(user: UserEntity): Promise<UserEntity>
}

export {
    LoginUserUseCaseRepositoryInterface,
    CreateUserUseCaseRepositoryInterface
}