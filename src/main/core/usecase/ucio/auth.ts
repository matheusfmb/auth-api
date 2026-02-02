import { ErrorEntity } from "../../entities/error"
import { UserEntity } from "../../entities/user"

class AuthMiddlewareUseCaseRequest {
    public accessToken: string
    public refreshToken: string

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}

class AuthMiddlewareUseCaseResponse {
  public user: UserEntity | null
  public accessToken: string | null
  public refreshToken: string | null
  public error: ErrorEntity | null

  constructor(user: UserEntity | null, accessToken: string | null, refreshToken: string | null, error: ErrorEntity | null) {
    this.user = user
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.error = error
  }
}

export {
    AuthMiddlewareUseCaseRequest,
    AuthMiddlewareUseCaseResponse
}