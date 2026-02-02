import { v4 } from "uuid"
import bcrypt from "bcryptjs"
import { CreateUserUseCaseCommonInterface, LoginUserUseCaseCommonInterface } from "../../../core/usecase/common/user"
import { newDate } from "../../internal/common/date"
import { TokenPayloadEntity } from "../../../core/entities/token"
import { encrypt } from "../../internal/jwt/jwt"

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
}


export {
    LoginUserUseCaseCommon,
    CreateUserUseCaseCommon
}