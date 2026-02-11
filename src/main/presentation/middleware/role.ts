import { NextFunction, Request, Response } from 'express'
import { mapErrorToHttp } from '../http/http_mappers'
import { RoleMiddlewareUseCaseRequest } from '../../core/usecase/ucio/role'
import { RoleMiddlewareUseCase } from '../../core/usecase/role'

class RoleMiddlewareController {
  constructor(private usecase: RoleMiddlewareUseCase) {}

  requireRoles(roles: string[] = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user

      const ucReq = new RoleMiddlewareUseCaseRequest(user, roles)

      const ucRes = await this.usecase.roleMiddleware(ucReq)

      if (ucRes.error) {
        const http = mapErrorToHttp(ucRes.error)
        return res.status(http.statusCode).json(http.body)
      }
      return next()
    }
  }
}

export { RoleMiddlewareController }