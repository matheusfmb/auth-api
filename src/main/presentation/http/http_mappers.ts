import { ConflictError, ErrorEntity, InternalServerError, PreconditionError, UnauthorizedError } from "../../core/entities/error"
import { HttpResponseFactory } from "./http_response"

const HttpErrorMapper = {
  map(error: ErrorEntity) {
    if (error instanceof PreconditionError) {
      return HttpResponseFactory.custom(422, { error: error.message })
    }
    if (error instanceof ConflictError) {
      return HttpResponseFactory.custom(409, { error: error.message })
    }
    if (error instanceof UnauthorizedError) {
      return HttpResponseFactory.custom(401, { error: error.message })
    }
    if (error instanceof InternalServerError) {
      return HttpResponseFactory.custom(500, { error: "Internal server error" })
    }
    return HttpResponseFactory.custom(500, { error: error.message })
  }
}

export { HttpErrorMapper }