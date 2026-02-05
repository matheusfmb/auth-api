import { NextFunction, Request, Response } from 'express'
import { ForbiddenError, UnauthorizedError } from '../../core/entities/error'
import { mapErrorToHttp } from '../http/http_mappers'

class RoleMiddlewareController {
  requireRoles(roles: string[] = []) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user

      if (!user) {
        const http = mapErrorToHttp(new UnauthorizedError('Unauthorized'))
        return res.status(http.statusCode).json(http.body)
      }

      if (roles.length > 0 && !roles.includes(user.role)) {
        const http = mapErrorToHttp(new ForbiddenError('Insufficient role'))
        return res.status(http.statusCode).json(http.body)
      }

      return next()
    }
  }
}

export { RoleMiddlewareController }