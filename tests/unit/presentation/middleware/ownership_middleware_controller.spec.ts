import { ForbiddenError, UnauthorizedError } from '../../../../src/main/core/entities/error'
import { OwnershipMiddlewareController } from '../../../../src/main/presentation/middleware/ownership'

jest.mock('../../../../src/main/presentation/http/http_mappers', () => ({
  mapErrorToHttp: jest.fn()
}))

const { mapErrorToHttp } = jest.requireMock('../../../../src/main/presentation/http/http_mappers') as { mapErrorToHttp: jest.Mock }

describe('OwnershipMiddlewareController', () => {
  let controller: OwnershipMiddlewareController
  let req: any
  let res: any
  let next: jest.Mock
  let mockUseCase: any
  let ownershipMiddlewareMock: jest.Mock

  beforeEach(() => {
    ownershipMiddlewareMock = jest.fn()
    mockUseCase = {
      ownershipMiddleware: ownershipMiddlewareMock
    }
    controller = new OwnershipMiddlewareController(mockUseCase)
    req = { params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      locals: {}
    }
    next = jest.fn()
    mapErrorToHttp.mockReset()
    ownershipMiddlewareMock.mockReset()
  })

  it('passes if user is owner', async () => {
    res.locals.user = { ID: '123', role: 'user' }
    req.params.userID = '123'
    ownershipMiddlewareMock.mockResolvedValue({ error: null })
    const handler = controller.ownershipMiddleware('userID')
    await handler(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('passes if user is admin', async () => {
    res.locals.user = { ID: '456', role: 'admin' }
    req.params.userID = '123'
    ownershipMiddlewareMock.mockResolvedValue({ error: null })
    const handler = controller.ownershipMiddleware('userID')
    await handler(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('blocks if not owner and not admin', async () => {
    res.locals.user = { ID: '456', role: 'user' }
    req.params.userID = '123'
    ownershipMiddlewareMock.mockResolvedValue({ error: new ForbiddenError('Forbidden resource') })
    mapErrorToHttp.mockReturnValue({ statusCode: 403, body: { error: 'Forbidden' } })
    const handler = controller.ownershipMiddleware('userID')
    await handler(req, res, next)
    expect(mapErrorToHttp).toHaveBeenCalledWith(new ForbiddenError('Forbidden resource'))
  })

  it('blocks if no user', async () => {
    ownershipMiddlewareMock.mockResolvedValue({ error: new UnauthorizedError('Unauthorized') })
    mapErrorToHttp.mockReturnValue({ statusCode: 401, body: { error: 'Unauthorized' } })
    const handler = controller.ownershipMiddleware('userID')
    await handler(req, res, next)
    expect(mapErrorToHttp).toHaveBeenCalledWith(new UnauthorizedError('Unauthorized'))
  })
})