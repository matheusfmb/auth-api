import { NextFunction, Request, Response } from 'express'
import { mapErrorToHttp } from '../http/http_mappers'
import { OwnershipMiddlwareUseCaseRequest } from '../../core/usecase/ucio/ownership'
import { OwnerShipMiddlwareUseCase } from '../../core/usecase/ownership'

class OwnershipMiddlewareController {
  constructor(private usecase: OwnerShipMiddlwareUseCase) {}

  ownershipMiddleware(paramKey: string = 'userID') {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = res.locals.user
      const ownerID = req.params?.[paramKey]

      const ucReq = new OwnershipMiddlwareUseCaseRequest(user, ownerID)
      const ucRes = await this.usecase.ownershipMiddleware(ucReq)

      if (ucRes.error) {
        const http = mapErrorToHttp(ucRes.error)
        return res.status(http.statusCode).json(http.body)
      }

      return next()
    }
  }
}

export { OwnershipMiddlewareController }