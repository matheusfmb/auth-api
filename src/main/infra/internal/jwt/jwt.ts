import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import { TokenPayloadEntity } from '../../../core/entities/token'
import { SECRET_KEY, EXPIRES_IN, LONG_DURATION_EXPIRES_IN } from './config'

function encrypt(data: TokenPayloadEntity, expiresIn: any): string {
    const jti = data.jti || v4()
    
    const token = jwt.sign({ ...data, jti }, SECRET_KEY, { expiresIn })

    return token
}

function decodeToken(token: string): TokenPayloadEntity | null {
    try {
        const data: any = jwt.verify(token, SECRET_KEY)

        return data
    } catch (error: any) {
        return null
    }
}

function encodeToken(param: any): string {
    const token = jwt.sign(param, SECRET_KEY, { expiresIn: EXPIRES_IN })

    return token
}

export {
    encrypt,
    decodeToken,
    encodeToken
}
