class TokenPayloadEntity {
    public userID: string
    public role: string
    public expireAt: number
    public createdAt: number
    public iat?:number
    public exp?:number

    constructor(userID: string, role: string, expireAt: number, createdAt: number) {
        this.userID = userID
        this.role = role
        this.expireAt = expireAt
        this.createdAt = createdAt
    }
}

export {
    TokenPayloadEntity
}
