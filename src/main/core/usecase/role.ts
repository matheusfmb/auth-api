import { ForbiddenError, InternalServerError, UnauthorizedError } from "../entities/error"
import { RoleMiddlewareUseCaseCommonInterface } from "./common/role"
import { RoleMiddlewareUseCaseRequest, RoleMiddlewareUseCaseResponse } from "./ucio/role"
import { RoleMiddlewareUseCaseValidateInterface } from "./validate/role"

class RoleMiddlewareUseCase {
    public common: RoleMiddlewareUseCaseCommonInterface
    public validate: RoleMiddlewareUseCaseValidateInterface

    constructor(common: RoleMiddlewareUseCaseCommonInterface, validate: RoleMiddlewareUseCaseValidateInterface) {
        this.common = common
        this.validate = validate
    }
    async roleMiddleware(req: RoleMiddlewareUseCaseRequest): Promise<RoleMiddlewareUseCaseResponse> {
        try {
            const validationError = this.validate.roleMiddleware(req)
            if (validationError) {
                const errorEntity = this.common.mapValidationErrorToEntity(validationError)
                return new RoleMiddlewareUseCaseResponse(errorEntity)
            }
            if(!req.user){
                return new RoleMiddlewareUseCaseResponse(new UnauthorizedError('Unauthorized'))
            }
             if (req.roles.length > 0 && !req.roles.includes(req.user.role)) {
                return new RoleMiddlewareUseCaseResponse(new ForbiddenError('Insufficient role'))
            }
            return new RoleMiddlewareUseCaseResponse(null)
        } catch (error: any){
            return new RoleMiddlewareUseCaseResponse(new InternalServerError(error.message))
        }
    }
}

export {
    RoleMiddlewareUseCase
}