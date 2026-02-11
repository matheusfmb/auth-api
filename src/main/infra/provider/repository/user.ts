import { UserEntity } from "../../../core/entities/user"
import { CreateUserUseCaseRepositoryInterface, GetUserByIDUseCaseRepositoryInterface, LoginUserUseCaseRepositoryInterface, LogoutUserUseCaseRepositoryInterface } from "../../../core/usecase/repository/user"
import { createUser, getUserByEmail, getUserByID } from "../../internal/database/postgresql/user"
import { saveRefreshToken, addJtiToBlacklist, deleteRefreshToken } from "../../internal/database/redis/user"

class LoginUserUseCaseRepository implements LoginUserUseCaseRepositoryInterface {
    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return await getUserByEmail(email)
    }
    async saveRefreshTokenCache(token: string, userID: string, version: number): Promise<void> {
        return await saveRefreshToken(token, userID, version)
    }
}

class CreateUserUseCaseRepository implements CreateUserUseCaseRepositoryInterface {
    async createUser(user: UserEntity): Promise<UserEntity> {
        return await createUser(user)
    }
}

class GetUserByIDUseCaseRepository implements GetUserByIDUseCaseRepositoryInterface {
    async getUserByID(userID: string): Promise<UserEntity | null> {
        return await getUserByID(userID)
    }
}

class LogoutUserUseCaseRepository implements LogoutUserUseCaseRepositoryInterface {
    async addTokenToBlacklist(jti: string): Promise<void> {
        return await addJtiToBlacklist(jti)
    }
    async deleteRefreshToken(userID: string): Promise<void> {
        return await deleteRefreshToken(userID)
    }
}

export {
    LoginUserUseCaseRepository,
    CreateUserUseCaseRepository,
    GetUserByIDUseCaseRepository,
    LogoutUserUseCaseRepository
}