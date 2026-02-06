import { NextFunction, Request, Response } from 'express'
import { mapErrorToHttp } from '../http/http_mappers'
import { RoleMiddlewareUseCaseRequest } from '../../core/usecase/ucio/role'
import { RoleMiddlewareUseCaseValidate } from '../../infra/provider/validate/role'
import { RoleMiddlewareUseCase } from '../../core/usecase/role'
import { RoleMiddlewareUseCaseCommon } from '../../infra/provider/common/role'

class RoleMiddlewareController {
  requireRoles(roles: string[] = []) {
   return async (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user

      const ucReq = new RoleMiddlewareUseCaseRequest(user, roles)
      const common = new RoleMiddlewareUseCaseCommon()
      const validate = new RoleMiddlewareUseCaseValidate()
      const usecase = new RoleMiddlewareUseCase(common, validate)
      
      const ucRes = await usecase.roleMiddleware(ucReq)

      if (ucRes.error) {
        const http = mapErrorToHttp(ucRes.error)
        return res.status(http.statusCode).json(http.body)
      }
      return next()
    }
  }
}

export { RoleMiddlewareController }