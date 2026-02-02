import { TokenPayloadEntity } from "../../entities/token"

interface LoginUserUseCaseCommonInterface {
    comparePassword(password: string, hash: string): Promise<boolean>
    generateUUID(): string
    newDate(): Date
    generateToken(data: TokenPayloadEntity, expireIn: string | undefined): string
}

interface CreateUserUseCaseCommonInterface {
    generateUUID(): string
    newDate(): Date
    hashPassword(password: string): Promise<string>
}

export {
    LoginUserUseCaseCommonInterface,
    CreateUserUseCaseCommonInterface
}