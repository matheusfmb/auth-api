import { ValidationError } from "../../enums/error"
import { CreateUserUseCaseRequest, LoginUserUseCaseRequest } from "../ucio/user"

interface LoginUserUseCaseValidateInterface {
    login(req: LoginUserUseCaseRequest): ValidationError | null
}

interface CreateUserUseCaseValidateInterface {
    createUser(req: CreateUserUseCaseRequest): Promise<ValidationError | null>
}

export {
    LoginUserUseCaseValidateInterface,
    CreateUserUseCaseValidateInterface
}