import { ErrorEntity, ConflictError, PreconditionError, UnauthorizedError } from "../../../core/entities/error"
import { ValidationError, ValidationErrorType } from "../../../core/enums/error"

function checkStringEmpty(value: string): boolean {
    return !value || value.trim() === ""
}

function mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
  if (validationError.type === ValidationErrorType.CONFLICT) {
    return new ConflictError(validationError.message)
  }
  if (validationError.type === ValidationErrorType.UNAUTHORIZED) {
    return new UnauthorizedError(validationError.message)
  }
  return new PreconditionError(validationError.message)
}

export {
    checkStringEmpty,
    mapValidationErrorToEntity
}