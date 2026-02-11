import { ForbiddenError, UnauthorizedError } from '../../../../src/main/core/entities/error'
import { RoleMiddlewareController } from '../../../../src/main/presentation/middleware/role'

jest.mock('../../../../src/main/presentation/http/http_mappers', () => ({
  mapErrorToHttp: jest.fn()
}))

const { mapErrorToHttp } = jest.requireMock('../../../../src/main/presentation/http/http_mappers') as { mapErrorToHttp: jest.Mock }

describe('RoleMiddlewareController', () => {
  let controller: RoleMiddlewareController
  let req: any
  let res: any
  let next: jest.Mock
  let mockUseCase: any
  let roleMiddlewareMock: jest.Mock

  beforeEach(() => {
    roleMiddlewareMock = jest.fn()
    mockUseCase = {
      roleMiddleware: roleMiddlewareMock
    }
    controller = new RoleMiddlewareController(mockUseCase)
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {}
    }
    next = jest.fn()
    mapErrorToHttp.mockReset()
    roleMiddlewareMock.mockReset()
  })

  it('passes if user has required role', async () => {
    res.locals.user = { role: 'admin' }
    roleMiddlewareMock.mockResolvedValue({ error: null })
    const handler = controller.requireRoles(['admin'])
    await handler(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('blocks if user lacks role', async () => {
    res.locals.user = { role: 'user' }
    roleMiddlewareMock.mockResolvedValue({ error: new ForbiddenError('Insufficient role') })
    mapErrorToHttp.mockReturnValue({ statusCode: 403, body: { error: 'Forbidden' } })
    const handler = controller.requireRoles(['admin'])
    await handler(req, res, next)
    expect(mapErrorToHttp).toHaveBeenCalledWith(new ForbiddenError('Insufficient role'))
  })

  it('blocks if no user', async () => {
    roleMiddlewareMock.mockResolvedValue({ error: new UnauthorizedError('Unauthorized') })
    mapErrorToHttp.mockReturnValue({ statusCode: 401, body: { error: 'Unauthorized' } })
    const handler = controller.requireRoles(['admin'])
    await handler(req, res, next)
    expect(mapErrorToHttp).toHaveBeenCalledWith(new UnauthorizedError('Unauthorized'))
  })
})