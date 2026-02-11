import { NextFunction, Request, Response } from 'express'
import { AuthMiddlewareUseCase } from '../../core/usecase/auth'
import { AuthMiddlewareUseCaseRequest } from '../../core/usecase/ucio/auth'
import { mapErrorToHttp } from '../http/http_mappers'

class AuthMiddlewareController {
  constructor(private useCase: AuthMiddlewareUseCase) {}

  async authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const refreshToken = req.cookies?.refreshToken ?? ''

    const accessToken = authorization?.replace('Bearer ', '') ?? ''

    const ucReq = new AuthMiddlewareUseCaseRequest(accessToken, refreshToken)

    const ucRes = await this.useCase.authMiddleware(ucReq)

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
