class TokenPayloadEntity {
    public userID: string
    public role: string
    public expireAt: number
    public createdAt: number
    public jti: string
    public version?: number
    public iat?: number
    public exp?: number

    constructor(userID: string, role: string, expireAt: number, createdAt: number, jti: string = '', version?: number) {
        this.userID = userID
        this.role = role
        this.expireAt = expireAt
        this.createdAt = createdAt
        this.jti = jti
        this.version = version
    }
}

export {
    TokenPayloadEntity
}
