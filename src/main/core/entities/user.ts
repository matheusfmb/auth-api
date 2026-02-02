class UserEntity {
  public ID: string
  public name: string
  public email: string
  public password: string
  public role: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    ID: string,
    name: string,
    email: string,
    password: string,
    role: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.ID = ID
    this.name = name
    this.email = email
    this.password = password
    this.role = role
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export { UserEntity }
