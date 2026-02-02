import { ErrorEntity } from "../../entities/error"
import { TokenPayloadEntity } from "../../entities/token"
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

export {
    LoginUserUseCaseCommonInterface,
    CreateUserUseCaseCommonInterface
}