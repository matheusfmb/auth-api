import { ValidationError, ValidationErrorType } from "../../../core/enums/error"
import { AuthMiddlewareUseCaseRequest } from "../../../core/usecase/ucio/auth"
import { AuthMiddlewareUseCaseValidateInterface } from "../../../core/usecase/validate/auth"
import { checkStringEmpty } from "./validate"

class AuthMiddlewareUseCaseValidate implements AuthMiddlewareUseCaseValidateInterface {
    authMiddleware(req: AuthMiddlewareUseCaseRequest): ValidationError | null {
        if(checkStringEmpty(req.accessToken)) {
            return { type: ValidationErrorType.UNAUTHORIZED, message: "Access token is required." }
        }
        return null
    }
}

export {
    AuthMiddlewareUseCaseValidate
}