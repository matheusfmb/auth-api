import { DAY, REFRESH_KEY } from "../../../../core/constants/util"
import { ClientRedis } from "./connection"

async function saveRefreshToken(token: string): Promise<void> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    await client.set(`${REFRESH_KEY}:${token}`, token, 'EX', (1 * DAY))
}

async function getRefreshToken(token: string): Promise<string | null> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    return await client.get(`${REFRESH_KEY}:${token}`)
}

async function deleteRefreshToken(token: string): Promise<void> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    await client.del(`${REFRESH_KEY}:${token}`)
}

export {
    saveRefreshToken,
    deleteRefreshToken,
    getRefreshToken
}