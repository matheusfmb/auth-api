import { ErrorEntity, ConflictError, PreconditionError, UnauthorizedError } from "../../../core/entities/error"
import { ValidationError, ValidationErrorType } from "../../../core/enums/error"

function checkStringEmpty(value: string): boolean {
    return !value || value.trim() === ""
}

function checkListEmpty(list: any[]): ValidationError | null {
  if (!list || !Array.isArray(list) || list.length === 0) {
    return { type: ValidationErrorType.PRECONDITION, message: `List is required.` }
  }
  return null
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
  mapValidationErrorToEntity,
  checkListEmpty
}