enum ValidationErrorType {
    PRECONDITION = "PRECONDITION",
    CONFLICT = "CONFLICT",
    UNAUTHORIZED = 'UNAUTHORIZED'
}

interface ValidationError {
    type: ValidationErrorType
    message: string
}

export {
    ValidationErrorType,
    ValidationError
}