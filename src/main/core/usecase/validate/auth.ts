import { ValidationError } from "../../enums/error"
import { AuthMiddlewareUseCaseRequest } from "../ucio/auth"

interface AuthMiddlewareUseCaseValidateInterface {
    authMiddleware(req: AuthMiddlewareUseCaseRequest): ValidationError | null
}

export {
    AuthMiddlewareUseCaseValidateInterface
}