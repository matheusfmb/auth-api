import { BLACKLIST_KEY, DAY, REFRESH_KEY } from "../../../../core/constants/util"
import { ClientRedis } from "./connection"

async function saveRefreshToken(token: string, userID: string, version: number = 1): Promise<void> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    const key = `${REFRESH_KEY}:${userID}`
    await client.set(key, JSON.stringify({ token, version }), 'EX', (1 * DAY))
}

async function getRefreshToken(userID: string): Promise<{ token: string; version: number } | null> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    const key = `${REFRESH_KEY}:${userID}`
    const result = await client.get(key)
    
    if (!result) {
        return null
    }

    try {
        return JSON.parse(result)
    } catch {
        return null
    }
}

async function deleteRefreshToken(userID: string): Promise<void> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    const key = `${REFRESH_KEY}:${userID}`
    await client.del(key)
}

async function addJtiToBlacklist(jti: string, expiresIn: number = 1 * 60 * 60): Promise<void> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    const key = `${BLACKLIST_KEY}:${jti}`
    await client.set(key, jti, 'EX', expiresIn)
}

async function isJtiBlacklisted(jti: string): Promise<boolean> {
    const client = await ClientRedis.getClient()
    if (ClientRedis.errClientRedis) {
        throw new Error('Error on Redis connection')
    }

    const key = `${BLACKLIST_KEY}:${jti}`
    const result = await client.get(key)
    return result !== null
}

export {
    saveRefreshToken,
    deleteRefreshToken,
    getRefreshToken,
    addJtiToBlacklist,
    isJtiBlacklisted
}