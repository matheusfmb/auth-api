import { TokenPayloadEntity } from "../../main/core/entities/token"

declare global {
  namespace Express {
    interface Request {
      authUser?: TokenPayloadEntity
    }
  }
}

export {}
