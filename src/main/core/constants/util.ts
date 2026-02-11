const EXPIRE_IN_1H = '1h'
const EXPIRE_IN_24H = '24h'
const REFRESH_KEY = 'refresh_token'
const HOUR = 60 * 60
const DAY = 24 * HOUR
const BEARER_PREFIX = 'Bearer '
const BLACKLIST_KEY = 'token_blacklist'
const GENERIC_AUTH_ERROR = "Invalid email or password."


const ALL_ROLES_AUTORIZED = ['user', 'admin']
const ADMIN = ['admin']

export {
    EXPIRE_IN_1H,
    EXPIRE_IN_24H,
    REFRESH_KEY,
    HOUR,
    DAY,
    BEARER_PREFIX,
    ALL_ROLES_AUTORIZED,
    ADMIN,
    BLACKLIST_KEY,
    GENERIC_AUTH_ERROR
}