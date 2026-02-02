import { ValidationError, ValidationErrorType } from "../../../core/enums/error"
import { CreateUserUseCaseRequest, LoginUserUseCaseRequest } from "../../../core/usecase/ucio/user"
import { CreateUserUseCaseValidateInterface, LoginUserUseCaseValidateInterface } from "../../../core/usecase/validate/user"
import { getUserByEmail } from "../../internal/database/postgresql/user"
import { checkStringEmpty } from "./validate"

class LoginUserUseCaseValidate implements LoginUserUseCaseValidateInterface {
  login(req: LoginUserUseCaseRequest): ValidationError | null {
    if (checkStringEmpty(req.email)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Email is required." }
    }
    if (checkStringEmpty(req.password)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Password is required." }
    }
    return null
  }
}

class CreateUserUseCaseValidate implements CreateUserUseCaseValidateInterface {
  async createUser(req: CreateUserUseCaseRequest): Promise<ValidationError | null> {
    if (checkStringEmpty(req.name)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Name is required." }
    }
    if (checkStringEmpty(req.email)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Email is required." }
    }
    if (checkStringEmpty(req.password)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Password is required." }
    }
    if (checkStringEmpty(req.role)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Role is required." }
    }
    const user = await getUserByEmail(req.email)
    if(user) {
      return { type: ValidationErrorType.CONFLICT, message: "Email is already in use." }
    }
    
    return null
  }
}

export { LoginUserUseCaseValidate, CreateUserUseCaseValidate }
