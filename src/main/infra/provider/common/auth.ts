import { v4 } from "uuid"
import { TokenPayloadEntity } from "../../../core/entities/token"
import { AuthMiddlewareUseCaseCommonInterface } from "../../../core/usecase/common/auth"
import { decodeToken, encrypt } from "../../internal/jwt/jwt"
import { newDate } from "../../internal/common/date"
import { mapValidationErrorToEntity } from "../validate/validate"
import { ErrorEntity } from "../../../core/entities/error"
import { ValidationError } from "../../../core/enums/error"

class AuthMiddlewareUseCaseCommon implements AuthMiddlewareUseCaseCommonInterface {
  generateUUID(): string {
    return v4()
  }
  newDate(): Date {
    return newDate()
  }
  generateToken(data: TokenPayloadEntity, expireIn: string | undefined): string {
    return encrypt(data, expireIn)
  }
  decodeToken(token: string): TokenPayloadEntity | null {
    return decodeToken(token)
  }
  mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
        return mapValidationErrorToEntity(validationError)
    }
}

export {
    AuthMiddlewareUseCaseCommon
}