import { UserEntity } from "../../../../core/entities/user"
import { Connection } from "./connection"
import { UserModel } from "./model/user"
import { toUserEntity, toUserModel } from "./transformer/user"

async function createUser(user: UserEntity): Promise<UserEntity> {
  const repository = await Connection.getRepository(UserModel)
  const model = toUserModel(user)

  const data = await repository.save(model)

  return toUserEntity(data)
}

async function getUserByEmail(email: string): Promise<UserEntity | null> {
  const repository = await Connection.getRepository(UserModel)

  const user = await repository.findOneBy({ email })
  
  if (!user) return null

  return toUserEntity(user)
}

async function getUserByID(userID: string): Promise<UserEntity | null> {
  const repository = await Connection.getRepository(UserModel)

  const user = await repository.findOneBy({ ID: userID })

  if (!user) return null

  return toUserEntity(user)
}

export { createUser, getUserByEmail, getUserByID }
