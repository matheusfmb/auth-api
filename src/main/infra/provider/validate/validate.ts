import { ErrorEntity, ConflictError, PreconditionError } from "../../../core/entities/error"
import { ValidationError, ValidationErrorType } from "../../../core/enums/error"

function checkStringEmpty(value: string): boolean {
    return !value || value.trim() === ""
}

function mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
  if (validationError.type === ValidationErrorType.CONFLICT) {
    return new ConflictError(validationError.message)
  }
  return new PreconditionError(validationError.message)
}

export {
    checkStringEmpty,
    mapValidationErrorToEntity
}