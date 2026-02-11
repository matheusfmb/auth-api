import { AuthMiddlewareUseCase } from '../../../../src/main/core/usecase/auth'
import { AuthMiddlewareUseCaseCommonInterface } from '../../../../src/main/core/usecase/common/auth'
import { AuthMiddlewareUseCaseRepositoryInterface } from '../../../../src/main/core/usecase/repository/auth'
import { AuthMiddlewareUseCaseValidateInterface } from '../../../../src/main/core/usecase/validate/auth'
import { AuthMiddlewareUseCaseRequest } from '../../../../src/main/core/usecase/ucio/auth'
import { ValidationErrorType } from '../../../../src/main/core/enums/error'
import { UserEntity } from '../../../../src/main/core/entities/user'
import { TokenPayloadEntity } from '../../../../src/main/core/entities/token'
import { UnauthorizedError } from '../../../../src/main/core/entities/error'

const createCommonMock = (): jest.Mocked<AuthMiddlewareUseCaseCommonInterface> => ({
  generateUUID: jest.fn(),
  newDate: jest.fn(),
  generateToken: jest.fn(),
  decodeToken: jest.fn(),
  mapValidationErrorToEntity: jest.fn()
})

const createRepositoryMock = (): jest.Mocked<AuthMiddlewareUseCaseRepositoryInterface> => ({
  getRefreshToken: jest.fn(),
  saveRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
  isTokenBlacklisted: jest.fn(),
  addTokenToBlacklist: jest.fn(),
  getUserByID: jest.fn()
})

const createValidateMock = (): jest.Mocked<AuthMiddlewareUseCaseValidateInterface> => ({
  authMiddleware: jest.fn()
})

const createUser = (): UserEntity => {
  return new UserEntity(
    '25f95982-ef1f-49a6-a89e-b9b198729cd2',
    'matheus',
    'matheus@gmail.com',
    '$2a$10$gOf0DgulpiDncWz6YDix/ediWDbt.vtEOa2FZYxWNtWoP0NLkiPHe',
    'admin',
    new Date('2024-01-01T00:00:00Z'),
    new Date('2024-01-01T00:00:00Z')
  )
}

const createPayload = (overrides?: Partial<TokenPayloadEntity>): TokenPayloadEntity => ({
  userID: '25f95982-ef1f-49a6-a89e-b9b198729cd2',
  role: 'admin',
  expireAt: Date.now() + 3600,
  createdAt: Date.now(),
  jti: 'token-jti-123',
  version: 1,
  ...overrides
})

describe('AuthMiddlewareUseCase', () => {
  it('returns the user when the access token is valid', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const payload = createPayload()
    const user = createUser()

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken.mockReturnValue(payload)
    repository.isTokenBlacklisted.mockResolvedValue(false)
    repository.getUserByID.mockResolvedValue(user)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('access-token', 'refresh-token'))

    expect(response.error).toBeNull()
    expect(response.user).toEqual(user)
    expect(response.accessToken).toBeNull()
    expect(response.refreshToken).toBeNull()
    expect(repository.isTokenBlacklisted).toHaveBeenCalledWith(payload.jti)
    expect(repository.getRefreshToken).not.toHaveBeenCalled()
  })

  it('refreshes tokens when access token is invalid but refresh token is valid', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const user = createUser()
    const refreshPayload = createPayload({ expireAt: Date.now() + 7200, version: 1 })
    const userID = '25f95982-ef1f-49a6-a89e-b9b198729cd2'

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(refreshPayload)

    repository.isTokenBlacklisted
      .mockResolvedValueOnce(false)
    repository.getRefreshToken.mockResolvedValue({ token: 'old-refresh-token', version: 1 })
    repository.getUserByID.mockResolvedValue(user)

    const now = new Date('2024-01-01T00:00:00Z')
    const expireAt = new Date('2024-01-01T01:00:00Z')

    common.newDate
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(expireAt)

    common.generateToken
      .mockReturnValueOnce('new-access-token')
      .mockReturnValueOnce('new-refresh-token')

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('expired-access', 'old-refresh'))

    expect(repository.getRefreshToken).toHaveBeenCalledWith(userID)
    expect(repository.saveRefreshToken).toHaveBeenCalledWith('new-refresh-token', userID, 2)

    expect(response.user).toEqual(user)
    expect(response.accessToken).toBe('new-access-token')
    expect(response.refreshToken).toBe('new-refresh-token')
    expect(response.error).toBeNull()
  })

  it('returns unauthorized when refresh token is missing', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken.mockReturnValue(null)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('invalid-access', ''))

    expect(response.error).toBeInstanceOf(UnauthorizedError)
    expect(response.user).toBeNull()
    expect(repository.getRefreshToken).not.toHaveBeenCalled()
  })

  it('maps validation errors before executing business rules', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    validate.authMiddleware.mockReturnValue({
      type: ValidationErrorType.PRECONDITION,
      message: 'Access token is required.'
    })

    const mappedError = new UnauthorizedError('precondition failed')
    common.mapValidationErrorToEntity.mockReturnValue(mappedError)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('', ''))

    expect(common.mapValidationErrorToEntity).toHaveBeenCalled()
    expect(response.error).toBe(mappedError)
    expect(response.user).toBeNull()
    expect(repository.getUserByID).not.toHaveBeenCalled()
  })

  it('returns unauthorized when access token JTI is blacklisted', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const payload = createPayload()

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken.mockReturnValue(payload)
    repository.isTokenBlacklisted.mockResolvedValue(true)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('revoked-token', 'refresh-token'))

    expect(response.error).toBeInstanceOf(UnauthorizedError)
    expect(response.error?.message).toBe('Token has been revoked')
    expect(response.user).toBeNull()
    expect(repository.isTokenBlacklisted).toHaveBeenCalledWith(payload.jti)
    expect(repository.getUserByID).not.toHaveBeenCalled()
  })

  it('returns unauthorized when refresh token JTI is blacklisted', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const refreshPayload = createPayload()
    const userID = '25f95982-ef1f-49a6-a89e-b9b198729cd2'

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(refreshPayload)

    repository.isTokenBlacklisted.mockResolvedValueOnce(true)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('invalid-access', 'revoked-refresh'))

    expect(response.error).toBeInstanceOf(UnauthorizedError)
    expect(response.error?.message).toBe('Refresh token has been revoked')
    expect(response.user).toBeNull()
    expect(repository.deleteRefreshToken).toHaveBeenCalledWith(userID)
  })

  it('detects suspicious activity when refresh token version mismatches', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const userID = '25f95982-ef1f-49a6-a89e-b9b198729cd2'
    const refreshPayload = createPayload({ version: 1 })

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(refreshPayload)

    repository.isTokenBlacklisted.mockResolvedValueOnce(false)
    repository.getRefreshToken.mockResolvedValue({ token: 'stored-token', version: 3 })

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('invalid-access', 'old-refresh'))

    expect(response.error).toBeInstanceOf(UnauthorizedError)
    expect(response.error?.message).toBe('Suspicious activity detected. Please login again')
    expect(response.user).toBeNull()
    expect(repository.deleteRefreshToken).toHaveBeenCalledWith(userID)
  })

  it('returns unauthorized when refresh token is invalid in storage', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const refreshPayload = createPayload()

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(refreshPayload)

    repository.isTokenBlacklisted.mockResolvedValueOnce(false)
    repository.getRefreshToken.mockResolvedValue(null)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('invalid-access', 'unknown-refresh'))

    expect(response.error).toBeInstanceOf(UnauthorizedError)
    expect(response.error?.message).toBe('Refresh token is invalid')
    expect(response.user).toBeNull()
  })

  it('returns unauthorized when user not found during token refresh', async () => {
    const common = createCommonMock()
    const repository = createRepositoryMock()
    const validate = createValidateMock()
    const usecase = new AuthMiddlewareUseCase(common, validate, repository)

    const userID = '25f95982-ef1f-49a6-a89e-b9b198729cd2'
    const refreshPayload = createPayload({ version: 1 })

    validate.authMiddleware.mockReturnValue(null)
    common.decodeToken
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(refreshPayload)

    repository.isTokenBlacklisted.mockResolvedValueOnce(false)
    repository.getRefreshToken.mockResolvedValue({ token: 'stored-token', version: 1 })
    repository.getUserByID.mockResolvedValue(null)

    const response = await usecase.authMiddleware(new AuthMiddlewareUseCaseRequest('invalid-access', 'old-refresh'))

    expect(response.error).toBeInstanceOf(UnauthorizedError)
    expect(response.error?.message).toBe('User not found')
    expect(response.user).toBeNull()
    expect(repository.deleteRefreshToken).toHaveBeenCalledWith(userID)
  })
})
