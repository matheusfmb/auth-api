import { UserEntity } from "../../../core/entities/user"
import { CreateUserUseCaseRepositoryInterface, LoginUserUseCaseRepositoryInterface } from "../../../core/usecase/repository/user"
import { createUser, getUserByEmail } from "../../internal/database/postgresql/user"
import { saveRefreshToken } from "../../internal/database/redis/user"

class LoginUserUseCaseRepository implements LoginUserUseCaseRepositoryInterface {
    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return await getUserByEmail(email)
    }
    async saveRefreshTokenCache(token: string): Promise<void> {
        return await saveRefreshToken(token)
    }
}

class CreateUserUseCaseRepository implements CreateUserUseCaseRepositoryInterface {
    async createUser(user: UserEntity): Promise<UserEntity> {
        return await createUser(user)
    }
}

export {
    LoginUserUseCaseRepository,
    CreateUserUseCaseRepository
}