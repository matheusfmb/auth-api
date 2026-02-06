import { ErrorEntity } from "../../entities/error"
import { UserEntity } from "../../entities/user"

class OwnershipMiddlwareUseCaseRequest {
    public user: UserEntity
    public paramKey: string
    
    constructor(user: UserEntity, paramKey: string) {
        this.user = user
        this.paramKey = paramKey
    }
}

class OwnerShipMiddlwareUseCaseResponse {
    public error: ErrorEntity | null

    constructor(error: ErrorEntity | null){
        this.error = error
    }
}

export {
    OwnershipMiddlwareUseCaseRequest,
    OwnerShipMiddlwareUseCaseResponse
}