import { InternalServerError, UnauthorizedError, ForbiddenError } from "../entities/error"
import { OwnershipMiddlwareUseCaseRequest, OwnerShipMiddlwareUseCaseResponse } from "./ucio/ownership"

class OwnerShipMiddlwareUseCase {
    async ownershipMiddleware(req: OwnershipMiddlwareUseCaseRequest): Promise<OwnerShipMiddlwareUseCaseResponse> {
        try {
            if(!req.user){
                return new OwnerShipMiddlwareUseCaseResponse(new UnauthorizedError('Unauthorized'))
            }
            const ownerID = req.paramKey
            if (ownerID && req.user.role !== 'admin' && req.user.ID !== ownerID) {
                return new OwnerShipMiddlwareUseCaseResponse(new ForbiddenError('Forbidden resource'))
            }
            return new OwnerShipMiddlwareUseCaseResponse(null)
        } catch (error: any){
            return new OwnerShipMiddlwareUseCaseResponse(new InternalServerError(error.message))
        }
    }
}

export {
    OwnerShipMiddlwareUseCase
}