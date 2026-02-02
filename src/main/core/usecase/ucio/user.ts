import { ErrorEntity } from "../../entities/error"
import { UserEntity } from "../../entities/user"

class LoginUserUseCaseRequest { 
    public email: string
    public password: string

    constructor(email: string, password: string) {
        this.email = email
        this.password = password
    }
}

class LoginUserUseCaseResponse {
    public accessToken: string | null
    public refreshToken: string | null
    public error: ErrorEntity | null

    constructor(accessToken: string | null, refreshToken: string | null, error: ErrorEntity | null) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.error = error
    }
}

class CreateUserUseCaseRequest {
   public name: string
   public email: string
   public password: string
   public role: string

   constructor(name: string, email: string, password: string, role: string) {
       this.name = name
       this.email = email
       this.password = password
       this.role = role
   }
}

class CreateUserUseCaseResponse {
   public user: UserEntity | null
   public error: ErrorEntity | null

   constructor(user: UserEntity | null, error: ErrorEntity | null) {
       this.user = user
       this.error = error
   }    
}

class GetUserByIDUseCaseRequest {
    public userID: string

    constructor(userID: string) {
        this.userID = userID
    }
}

class GetUserByIDUseCaseResponse {
    public user: UserEntity | null
    public error: ErrorEntity | null

    constructor(user: UserEntity | null, error: ErrorEntity | null) {
        this.user = user
        this.error = error
    }   
}

export {
    LoginUserUseCaseRequest,
    LoginUserUseCaseResponse,
    CreateUserUseCaseRequest,
    CreateUserUseCaseResponse,
    GetUserByIDUseCaseRequest,
    GetUserByIDUseCaseResponse
}