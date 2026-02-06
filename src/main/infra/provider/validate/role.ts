import { ValidationError, ValidationErrorType } from "../../../core/enums/error"
import { RoleMiddlewareUseCaseRequest } from "../../../core/usecase/ucio/role"
import { RoleMiddlewareUseCaseValidateInterface } from "../../../core/usecase/validate/role"
import { checkListEmpty } from "./validate"

class RoleMiddlewareUseCaseValidate implements RoleMiddlewareUseCaseValidateInterface {
    roleMiddleware(req: RoleMiddlewareUseCaseRequest): ValidationError | null {
        if(checkListEmpty(req.roles)){
            return { type: ValidationErrorType.PRECONDITION, message: `Roles are required.` }
        }
        return null
    }
}

export {
    RoleMiddlewareUseCaseValidate
}