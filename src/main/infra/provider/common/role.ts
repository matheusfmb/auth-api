import { ErrorEntity } from "../../../core/entities/error"
import { ValidationError } from "../../../core/enums/error"
import { RoleMiddlewareUseCaseCommonInterface } from "../../../core/usecase/common/role"
import { mapValidationErrorToEntity } from "../validate/validate"

class RoleMiddlewareUseCaseCommon implements RoleMiddlewareUseCaseCommonInterface {
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
        return mapValidationErrorToEntity(validationError)
    }
}

export {
    RoleMiddlewareUseCaseCommon
}