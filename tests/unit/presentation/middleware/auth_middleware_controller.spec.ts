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
    const user = { ID: '25f95982-ef1f-49a6-a89e-b9b198729cd2', role: 'admin' }
    authMiddlewareExecuteMock.mockResolvedValue({
      user,
      accessToken: null,
      refreshToken: null,
      error: null
    })

    req.headers.authorization = 'Bearer valid-token'

    await controller.authMiddleware(req, res, next)

    expect(res.locals.user).toEqual(user)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.cookie).not.toHaveBeenCalled()
    expect(res.setHeader).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('sets new tokens and headers when refresh succeeds', async () => {
    const user = { ID: '25f95982-ef1f-49a6-a89e-b9b198729cd2', role: 'admin' }
    authMiddlewareExecuteMock.mockResolvedValue({
      user,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      error: null
    })

    req.headers.authorization = 'Bearer expired-token'
    req.cookies.refreshToken = 'old-refresh-token'

    await controller.authMiddleware(req, res, next)

    expect(res.locals.user).toEqual(user)
    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'new-refresh-token',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 3 * 60 * 60 * 1000
      })
    )
    expect(res.setHeader).toHaveBeenCalledWith('x-token-rotated', 'true')
    expect(res.setHeader).toHaveBeenCalledWith('x-access-token', 'new-access-token')
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('only sets access token header when refreshing without new refresh token', async () => {
    const user = { ID: '25f95982-ef1f-49a6-a89e-b9b198729cd2', role: 'admin' }
    authMiddlewareExecuteMock.mockResolvedValue({
      user,
      accessToken: 'new-access-token',
      refreshToken: null,
      error: null
    })

    req.headers.authorization = 'Bearer expired-token'

    await controller.authMiddleware(req, res, next)

    expect(res.locals.user).toEqual(user)
    expect(res.setHeader).toHaveBeenCalledWith('x-access-token', 'new-access-token')
    expect(res.cookie).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('maps domain errors to http responses', async () => {
    const domainError = new UnauthorizedError('Token has been revoked')

    authMiddlewareExecuteMock.mockResolvedValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: domainError
    })

    mapErrorToHttpMock.mockReturnValue({ 
      statusCode: 401, 
      body: { message: 'Token has been revoked' } 
    })

    req.headers.authorization = 'Bearer revoked-token'

    await controller.authMiddleware(req, res, next)

    expect(mapErrorToHttpMock).toHaveBeenCalledWith(domainError)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token has been revoked' })
    expect(next).not.toHaveBeenCalled()
  })

  it('handles suspicious activity error', async () => {
    const domainError = new UnauthorizedError('Suspicious activity detected. Please login again')

    authMiddlewareExecuteMock.mockResolvedValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: domainError
    })

    mapErrorToHttpMock.mockReturnValue({ 
      statusCode: 401, 
      body: { message: 'Suspicious activity detected. Please login again' } 
    })

    req.headers.authorization = 'Bearer token'
    req.cookies.refreshToken = 'old-refresh'

    await controller.authMiddleware(req, res, next)

    expect(mapErrorToHttpMock).toHaveBeenCalledWith(domainError)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('extracts access token from authorization header', async () => {
    authMiddlewareExecuteMock.mockResolvedValue({
      user: { ID: 'user-id', role: 'admin' },
      accessToken: null,
      refreshToken: null,
      error: null
    })

    req.headers.authorization = 'Bearer my-access-token'

    await controller.authMiddleware(req, res, next)

    expect(authMiddlewareExecuteMock).toHaveBeenCalled()
    const call = authMiddlewareExecuteMock.mock.calls[0]
    expect(call[0].accessToken).toBe('my-access-token')
  })

  it('extracts refresh token from cookies', async () => {
    authMiddlewareExecuteMock.mockResolvedValue({
      user: { ID: 'user-id', role: 'admin' },
      accessToken: null,
      refreshToken: null,
      error: null
    })

    req.headers.authorization = 'Bearer valid-token'
    req.cookies.refreshToken = 'my-refresh-token'

    await controller.authMiddleware(req, res, next)

    expect(authMiddlewareExecuteMock).toHaveBeenCalled()
    const call = authMiddlewareExecuteMock.mock.calls[0]
    expect(call[0].refreshToken).toBe('my-refresh-token')
  })

  it('handles missing authorization header', async () => {
    authMiddlewareExecuteMock.mockResolvedValue({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: new UnauthorizedError('Access token is required')
    })

    mapErrorToHttpMock.mockReturnValue({ 
      statusCode: 401, 
      body: { message: 'Access token is required' } 
    })

    req.headers = {}

    await controller.authMiddleware(req, res, next)

    expect(authMiddlewareExecuteMock).toHaveBeenCalled()
    const call = authMiddlewareExecuteMock.mock.calls[0]
    expect(call[0].accessToken).toBe('')
    expect(res.status).toHaveBeenCalledWith(401)
  })
})
