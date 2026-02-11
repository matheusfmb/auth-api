import { ValidationError } from "../../enums/error"
import { CreateUserUseCaseRequest, GetUserByIDUseCaseRequest, LoginUserUseCaseRequest, LogoutUserUseCaseRequest } from "../ucio/user"

interface LoginUserUseCaseValidateInterface {
    login(req: LoginUserUseCaseRequest): ValidationError | null
}

interface CreateUserUseCaseValidateInterface {
    createUser(req: CreateUserUseCaseRequest): Promise<ValidationError | null>
}

interface GetUserByIDUseCaseValidateInterface {
    getUserByIDByID(req: GetUserByIDUseCaseRequest): ValidationError | null
}

interface LogoutUserUseCaseValidateInterface {
    logout(req: LogoutUserUseCaseRequest): ValidationError | null
}

export {
    LoginUserUseCaseValidateInterface,
    CreateUserUseCaseValidateInterface,
    GetUserByIDUseCaseValidateInterface,
    LogoutUserUseCaseValidateInterface
}