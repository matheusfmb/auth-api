import { ValidationError } from "../../enums/error"
import { CreateUserUseCaseRequest, GetUserByIDUseCaseRequest, LoginUserUseCaseRequest } from "../ucio/user"

interface LoginUserUseCaseValidateInterface {
    login(req: LoginUserUseCaseRequest): ValidationError | null
}

interface CreateUserUseCaseValidateInterface {
    createUser(req: CreateUserUseCaseRequest): Promise<ValidationError | null>
}

interface GetUserByIDUseCaseValidateInterface {
    getUserByIDByID(req: GetUserByIDUseCaseRequest): ValidationError | null
}

export {
    LoginUserUseCaseValidateInterface,
    CreateUserUseCaseValidateInterface,
    GetUserByIDUseCaseValidateInterface
}