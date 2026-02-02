import { ErrorEntity } from "../../entities/error"
import { TokenPayloadEntity } from "../../entities/token"
import { UserEntity } from "../../entities/user"
import { ValidationError } from "../../enums/error"

interface AuthMiddlewareUseCaseCommonInterface {
    generateUUID(): string
    newDate(): Date
    generateToken(data: TokenPayloadEntity, expireIn: string | undefined): string
    decodeToken(token: string): TokenPayloadEntity | null
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity
}

export {
    AuthMiddlewareUseCaseCommonInterface
}