import { v4 } from "uuid"
import bcrypt from "bcryptjs"
import { CreateUserUseCaseCommonInterface, GetUserByIDUseCaseCommonInterface, LoginUserUseCaseCommonInterface } from "../../../core/usecase/common/user"
import { newDate } from "../../internal/common/date"
import { TokenPayloadEntity } from "../../../core/entities/token"
import { encrypt } from "../../internal/jwt/jwt"
import { ErrorEntity } from "../../../core/entities/error"
import { ValidationError } from "../../../core/enums/error"
import { mapValidationErrorToEntity } from "../validate/validate"

class LoginUserUseCaseCommon implements LoginUserUseCaseCommonInterface {
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
    generateToken(data: TokenPayloadEntity, expireIn: string | undefined): string {
        return encrypt(data, expireIn)
    }
    generateUUID(): string {
        return v4()
    }

    newDate(): Date {
        return newDate()
    }

    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
        return mapValidationErrorToEntity(validationError)
    }
}

class CreateUserUseCaseCommon implements CreateUserUseCaseCommonInterface {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    }
    generateUUID(): string {
        return v4()
    }

    newDate(): Date {
        return newDate()
    }

    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
        return mapValidationErrorToEntity(validationError)
    }
}

class GetUserByIDUseCaseCommon implements GetUserByIDUseCaseCommonInterface {
    mapValidationErrorToEntity(validationError: ValidationError): ErrorEntity {
        return mapValidationErrorToEntity(validationError)
    }
}

export {
    LoginUserUseCaseCommon,
    CreateUserUseCaseCommon,
    GetUserByIDUseCaseCommon
}