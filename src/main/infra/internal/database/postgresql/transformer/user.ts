import { UserEntity } from "../../../../../core/entities/user"
import { UserModel } from "../model/user"

function toUserEntity(m: UserModel): UserEntity {
  return new UserEntity(
   m.ID,
   m.name,
   m.email,
   m.password,
   m.role,
   m.createdAt,
   m.updatedAt
  )
}

function toUserModel(e: UserEntity): UserModel {
  return new UserModel(
    e.ID,
    e.name,
    e.email,
    e.password,
    e.role,
    e.createdAt,
    e.updatedAt
  )
}

export {
    toUserEntity,
    toUserModel
}