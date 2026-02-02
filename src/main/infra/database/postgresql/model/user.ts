import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity({ schema: "security", name: "users" })
class UserModel {
  @PrimaryColumn("uuid", { name: "user_id" })
  public ID: string

  @Column({ type: "varchar", length: 255, nullable: false })
  public name: string

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  public email: string

  @Column({ type: "varchar", length: 255, nullable: false })
  public password: string

  @Column({ type: "varchar", length: 50, nullable: false })
  public role: string

  @Column({ name: "created_at", nullable: false })
  public createdAt: Date

  @Column({ name: "updated_at", nullable: false })
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

export { UserModel }
