import { CreateUserUseCaseRequest, LoginUserUseCaseRequest } from "../../../core/usecase/ucio/user"
import { CreateUserUseCaseValidateInterface, LoginUserUseCaseValidateInterface } from "../../../core/usecase/validate/user"
import { getUserByEmail } from "../../internal/database/postgresql/user"
import { checkStringEmpty } from "./validate"

class LoginUserUseCaseValidate implements LoginUserUseCaseValidateInterface {
  login(req: LoginUserUseCaseRequest): string | null {
    if (checkStringEmpty(req.email)) {
      return "Email is required."
    }
    if (checkStringEmpty(req.password)) {
      return "Password is required."
    }
    return null
  }
}

class CreateUserUseCaseValidate implements CreateUserUseCaseValidateInterface {
  async createUser(req: CreateUserUseCaseRequest): Promise<string | null> {
    if (checkStringEmpty(req.name)) {
      return "Name is required."
    }
    if (checkStringEmpty(req.email)) {
      return "Email is required."
    }
    if (checkStringEmpty(req.password)) {
      return "Password is required."
    }
    if (checkStringEmpty(req.role)) {
      return "Role is required."
    }
    const user = await getUserByEmail(req.email)
    if(user) {
      return 'Email is already in use.'
    }
    
    return null
  }
}

export { LoginUserUseCaseValidate, CreateUserUseCaseValidate }
