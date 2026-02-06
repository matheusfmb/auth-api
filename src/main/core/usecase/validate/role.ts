import { ValidationError } from "../../enums/error"
import { RoleMiddlewareUseCaseRequest } from "../ucio/role"

interface RoleMiddlewareUseCaseValidateInterface {
    roleMiddleware(req: RoleMiddlewareUseCaseRequest): ValidationError | null
}

export {
    RoleMiddlewareUseCaseValidateInterface
}