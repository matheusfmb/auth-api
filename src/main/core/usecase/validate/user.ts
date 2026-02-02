import { CreateUserUseCaseRequest, LoginUserUseCaseRequest } from "../ucio/user"

interface LoginUserUseCaseValidateInterface {
    login(req: LoginUserUseCaseRequest): string | null
}

interface CreateUserUseCaseValidateInterface {
    createUser(req: CreateUserUseCaseRequest): Promise<string | null> 
}

export {
    LoginUserUseCaseValidateInterface,
    CreateUserUseCaseValidateInterface
}