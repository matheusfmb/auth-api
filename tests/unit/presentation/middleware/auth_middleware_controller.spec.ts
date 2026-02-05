import { UnauthorizedError } from '../../../../src/main/core/entities/error'
import { AuthMiddlewareController } from '../../../../src/main/presentation/middleware/auth'

const authMiddlewareExecuteMock = jest.fn()

jest.mock('../../../../src/main/core/usecase/auth', () => {
  return {
    AuthMiddlewareUseCase: jest.fn().mockImplementation(() => ({
      authMiddleware: authMiddlewareExecuteMock
    }))
  }
})

jest.mock('../../../../src/main/presentation/http/http_mappers', () => ({
  mapErrorToHttp: jest.fn()
}))

const { mapErrorToHttp } = jest.requireMock('../../../../src/main/presentation/http/http_mappers') as { mapErrorToHttp: jest.Mock }
const mapErrorToHttpMock = mapErrorToHttp as jest.Mock

describe('AuthMiddlewareController', () => {
  let controller: AuthMiddlewareController
  let req: any
  let res: any
  let next: jest.Mock

  beforeEach(() => {
    controller = new AuthMiddlewareController()

    req = {
      headers: {},
      cookies: {}
    }

    res = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {}
    }

    next = jest.fn()

    authMiddlewareExecuteMock.mockReset()
    mapErrorToHttpMock.mockReset()
  })

  it('passes through when tokens are valid and nothing needs rotation', async () => {
    authMiddlewareExecuteMock.mockResolvedValue({
      user: { ID: '25f95982-ef1f-49a6-a89e-b9b198729cd2' },
      accessToken: null,
      refreshToken: null,
      error: null
    })

    req.headers.authorization = 'Bearer valid-token'

    await controller.authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.cookie).not.toHaveBeenCalled()
    expect(res.setHeader).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('sets new tokens and headers when refresh succeeds', async () => {
    authMiddlewareExecuteMock.mockResolvedValue({
      user: { ID: '25f95982-ef1f-49a6-a89e-b9b198729cd2' },
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      error: null
    })

    req.headers.authorization = 'Bearer expired-token'
    req.cookies.refreshToken = 'old-refresh'

    await controller.authMiddleware(req, res, next)

    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'new-refresh',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict'
      })
    )
    expect(res.setHeader).toHaveBeenCalledWith('x-access-token', 'new-access')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('maps domain errors to http responses', async () => {
    const domainError = new UnauthorizedError('Invalid access token')

    authMiddlewareExecuteMock.mockResolvedValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: domainError
    })

    mapErrorToHttpMock.mockReturnValue({ statusCode: 401, body: { error: 'Invalid access token' } })

    await controller.authMiddleware(req, res, next)

    expect(mapErrorToHttpMock).toHaveBeenCalledWith(domainError)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid access token' })
    expect(next).not.toHaveBeenCalled()
  })
})
