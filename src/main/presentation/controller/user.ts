import { CreateUserUseCaseRequest, GetUserByIDUseCaseRequest, LoginUserUseCaseRequest, LogoutUserUseCaseRequest } from "../../core/usecase/ucio/user"
import { Request, Response } from 'express'
import { CreateUserUseCase, GetUserByIDUseCase, LoginUserUseCase, LogoutUserUseCase } from "../../core/usecase/user"
import { mapErrorToHttp } from "../http/http_mappers"
import { HttpResponseFactory } from "../http/http_response"

class LoginController {
    constructor(private usecase: LoginUserUseCase) {}

    async login(req: Request, res: Response) {
        const { email, password } = req.body
        const ucReq = new LoginUserUseCaseRequest(email, password)

        const ucRes = await this.usecase.login(ucReq)

        if (ucRes.error) {
            const http = mapErrorToHttp(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }

        if (ucRes.refreshToken) {
            res.cookie('refreshToken', ucRes.refreshToken, {
                httpOnly: true,
                secure: false, //develop only
                sameSite: 'strict',
                maxAge: 3 * 60 * 60 * 1000
            })
        }
        const http = HttpResponseFactory.ok({ accessToken: ucRes.accessToken })
        return res.status(http.statusCode).json(http.body)
    }
}

class CreateUserController {
    constructor(private usecase: CreateUserUseCase) {}

    async createUser(req: Request, res: Response) {
        const { name, email, password, role } = req.body

        const ucReq = new CreateUserUseCaseRequest(name, email, password, role)

        const ucRes = await this.usecase.createUser(ucReq)

        if (ucRes.error) {
            const http = mapErrorToHttp(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }
        const http = HttpResponseFactory.created(ucRes.user)
        return res.status(http.statusCode).json(http.body)
    }
}

class GetUserByIDController {
    constructor(private usecase: GetUserByIDUseCase) {}

    async getUserByID(req: Request, res: Response) {
        const { userID } = req.params

        const ucReq = new GetUserByIDUseCaseRequest(userID)

        const ucRes = await this.usecase.getUserByID(ucReq)

        if (ucRes.error) {
            const http = mapErrorToHttp(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }
        const http = HttpResponseFactory.ok(ucRes.user)
        return res.status(http.statusCode).json(http.body)
    }
}

class LogoutController {
    constructor(private usecase: LogoutUserUseCase) {}

    async logout(req: Request, res: Response) {
        const authHeader = req.headers.authorization ?? ''
        const accessToken = authHeader.replace('Bearer ', '')
        const refreshToken = req.cookies?.refreshToken ?? ''
        const user = res.locals.user
        const userID = user?.ID ?? ''

        const ucReq = new LogoutUserUseCaseRequest(userID, accessToken, refreshToken)

        const ucRes = await this.usecase.logout(ucReq)

        if (ucRes.error) {
            const http = mapErrorToHttp(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })

        const http = HttpResponseFactory.ok({ message: 'Logged out successfully' })
        return res.status(http.statusCode).json(http.body)
    }
}

export {
    LoginController,
    CreateUserController,
    GetUserByIDController,
    LogoutController
}