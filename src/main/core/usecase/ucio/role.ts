import { ErrorEntity } from "../../entities/error"
import { UserEntity } from "../../entities/user"

class RoleMiddlewareUseCaseRequest {
    public user: UserEntity
    public roles: string[]

    constructor(user: UserEntity, roles: string[] = []) {
        this.user = user
        this.roles = roles
    }
}

class RoleMiddlewareUseCaseResponse {
    public error: ErrorEntity | null

    constructor(error: ErrorEntity | null) {
        this.error = error
    }
}

export {
    RoleMiddlewareUseCaseRequest,
    RoleMiddlewareUseCaseResponse
}