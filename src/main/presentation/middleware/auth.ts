import { NextFunction, Request, Response } from 'express'
import { AuthMiddlewareUseCase } from '../../core/usecase/auth'
import { AuthMiddlewareUseCaseRequest } from '../../core/usecase/ucio/auth'
import { AuthMiddlewareUseCaseCommon } from '../../infra/provider/common/auth'
import { AuthMiddlewareUseCaseRepository } from '../../infra/provider/repository/auth'
import { mapErrorToHttp } from '../http/http_mappers'
import { AuthMiddlewareUseCaseValidate } from '../../infra/provider/validate/auth'

class AuthMiddlewareController {
  async authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const refreshToken = req.cookies?.refreshToken ?? ''

    const accessToken = authorization?.replace('Bearer ', '') ?? ''

    const ucReq = new AuthMiddlewareUseCaseRequest(accessToken, refreshToken)

    const common = new AuthMiddlewareUseCaseCommon()
    const validate = new AuthMiddlewareUseCaseValidate()
    const repository = new AuthMiddlewareUseCaseRepository()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const ucRes = await usecase.authMiddleware(ucReq)

    if (ucRes.error) {
      const http = mapErrorToHttp(ucRes.error)
      return res.status(http.statusCode).json(http.body)
    }

    if (ucRes.user) {
      res.locals.user = ucRes.user
    }

    if (ucRes.refreshToken) {
      res.cookie('refreshToken', ucRes.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 3 * 60 * 60 * 1000
      })
      res.setHeader('x-token-rotated', 'true')
    }

    if (ucRes.accessToken) {
      res.setHeader('x-access-token', ucRes.accessToken)
    }

    return next()
  }
}

export { AuthMiddlewareController }
