import { NextFunction, Request, Response } from 'express'
import { ForbiddenError, UnauthorizedError } from '../../core/entities/error'
import { mapErrorToHttp } from '../http/http_mappers'

class OwnershipMiddlewareController {
  ownershipMiddleware(paramKey: string = 'userID') {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user

      if (!user) {
        const http = mapErrorToHttp(new UnauthorizedError('Unauthorized'))
        return res.status(http.statusCode).json(http.body)
      }

      const ownerID = req.params?.[paramKey]

      if (ownerID && user.role !== 'admin' && user.ID !== ownerID) {
        const http = mapErrorToHttp(new ForbiddenError('Forbidden resource'))
        return res.status(http.statusCode).json(http.body)
      }

      return next()
    }
  }
}

export { OwnershipMiddlewareController }