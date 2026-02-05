const TAG_INTERNAL_SERVER_ERROR = "[INTERNAL SERVER ERROR]"
const TAG_PRE_CONDITION_ERROR = "[PRE CONDITION ERROR]"

class ErrorEntity {
  public code: number
  public message: string

  constructor(code: number, message: string) {
    this.code = code
    this.message = message
  }
}

class PreconditionError extends ErrorEntity {
  static PRECONDITION_ERROR = 1

  constructor(message: string) {
    super(PreconditionError.PRECONDITION_ERROR, message)
  }
}

class InternalServerError extends ErrorEntity {
  static INTERNAL_SERVER_ERROR = 2

  constructor(message: string) {
    super(InternalServerError.INTERNAL_SERVER_ERROR, message)
  }
}

class ConflictError extends ErrorEntity {
  static CONFLICT_ERROR = 3

  constructor(message: string) {
    super(ConflictError.CONFLICT_ERROR, message)
  }
}

class UnauthorizedError extends ErrorEntity {
  static UNAUTHORIZED_ERROR = 4

  constructor(message: string) {
    super(UnauthorizedError.UNAUTHORIZED_ERROR, message)
  }
}

class ForbiddenError extends ErrorEntity {
  static FORBIDDEN_ERROR = 6

  constructor(message: string) {
    super(ForbiddenError.FORBIDDEN_ERROR, message)
  }
}

class NotFoundError extends ErrorEntity {
  static NOT_FOUND_ERROR = 5

  constructor(message: string) {
    super(NotFoundError.NOT_FOUND_ERROR, message)
  }
}

export { 
  ErrorEntity,
  PreconditionError,
  InternalServerError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  TAG_INTERNAL_SERVER_ERROR,
  TAG_PRE_CONDITION_ERROR
}
