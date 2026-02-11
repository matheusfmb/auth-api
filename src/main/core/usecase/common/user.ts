import { ErrorEntity } from "../../entities/error"
import { TokenPayloadEntity } from "../../entities/token"
import { UserEntity } from "../../entities/user"
import { ValidationError } from "../../enums/error"

interface LoginUserUseCaseCommonInterface {
    comparePassword(password: string, hash: string): Promise<boolean>
    generateUUID(): string
    newDate(): Date
    generateToken(data: TokenPayloadEntity, expireIn: string | undefined): string
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity
}

interface CreateUserUseCaseCommonInterface {
    generateUUID(): string
    newDate(): Date
    hashPassword(password: string): Promise<string>
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity
}

interface GetUserByIDUseCaseCommonInterface {
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity
}

interface LogoutUserUseCaseCommonInterface {
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity
    decodeToken(token: string): TokenPayloadEntity | null
}

export {
    LoginUserUseCaseCommonInterface,
    CreateUserUseCaseCommonInterface,
    GetUserByIDUseCaseCommonInterface,
    LogoutUserUseCaseCommonInterface
}