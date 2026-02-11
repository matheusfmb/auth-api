import { GENERIC_AUTH_ERROR } from "../../../core/constants/util"
import { ValidationError, ValidationErrorType } from "../../../core/enums/error"
import { CreateUserUseCaseRequest, GetUserByIDUseCaseRequest, LoginUserUseCaseRequest, LogoutUserUseCaseRequest } from "../../../core/usecase/ucio/user"
import { CreateUserUseCaseValidateInterface, GetUserByIDUseCaseValidateInterface, LoginUserUseCaseValidateInterface, LogoutUserUseCaseValidateInterface } from "../../../core/usecase/validate/user"
import { getUserByEmail } from "../../internal/database/postgresql/user"
import { checkStringEmpty, validateEmail, validatePasswordStrength } from "./validate"

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
    if (!validateEmail(req.email)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Invalid email format." }
    }
    if (checkStringEmpty(req.password)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Password is required." }
    }
    if (!validatePasswordStrength(req.password)) {
      return { 
        type: ValidationErrorType.PRECONDITION, 
        message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and symbol (@$!%*?&)." 
      }
    }
    if (checkStringEmpty(req.role)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Role is required." }
    }
    
    const user = await getUserByEmail(req.email)
    if(user) {
      return { type: ValidationErrorType.PRECONDITION, message: GENERIC_AUTH_ERROR }
    }
    
    return null
  }
}

class GetUserByIDUseCaseValidate implements GetUserByIDUseCaseValidateInterface {
  getUserByIDByID(req: GetUserByIDUseCaseRequest): ValidationError | null {
    if (checkStringEmpty(req.userID)) {
      return { type: ValidationErrorType.PRECONDITION, message: "UserID is required." }
    }
    return null
  }
}

class LogoutUserUseCaseValidate implements LogoutUserUseCaseValidateInterface {
  logout(req: LogoutUserUseCaseRequest): ValidationError | null {
    if (checkStringEmpty(req.accessToken)) {
      return { type: ValidationErrorType.PRECONDITION, message: "Access token is required." }
    }
    if (checkStringEmpty(req.userID)) {
      return { type: ValidationErrorType.PRECONDITION, message: "UserID is required." }
    }
    return null
  }
}

export { LoginUserUseCaseValidate, CreateUserUseCaseValidate, GetUserByIDUseCaseValidate, LogoutUserUseCaseValidate }