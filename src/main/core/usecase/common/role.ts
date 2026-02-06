import { ErrorEntity } from "../../../core/entities/error"
import { ValidationError } from "../../../core/enums/error"

interface RoleMiddlewareUseCaseCommonInterface  {
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity 
}

export {
    RoleMiddlewareUseCaseCommonInterface
}