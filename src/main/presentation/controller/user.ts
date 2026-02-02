import { CreateUserUseCaseRequest, CreateUserUseCaseResponse, LoginUserUseCaseRequest } from "../../core/usecase/ucio/user"
import { CreateUserUseCaseValidate, LoginUserUseCaseValidate } from "../../infra/provider/validate/user"
import { CreateUserUseCaseCommon, LoginUserUseCaseCommon } from "../../infra/provider/common/user"
import { Request, Response } from 'express'
import { CreateUserUseCaseRepository, LoginUserUseCaseRepository } from "../../infra/provider/repository/user"
import { CreateUserUseCase, LoginUserUseCase } from "../../core/usecase/user"
import { HttpErrorMapper } from "../http/http_mappers"
import { HttpResponseFactory } from "../http/http_response"

class LoginController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body

        const ucReq = new LoginUserUseCaseRequest(email, password)
        const common = new LoginUserUseCaseCommon()
        const validate = new LoginUserUseCaseValidate()
        const repository = new LoginUserUseCaseRepository()

        const usecase = new LoginUserUseCase(common, repository, validate)

        const result = await usecase.login(ucReq)

        if (result.error) {
            const http = HttpErrorMapper.map(result.error)
            return res.status(http.statusCode).json(http.body)
        }

        if (result.refreshToken) {
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: false, //develop only
                sameSite: 'strict',
                path: '/auth/refresh', // to be implemented
                maxAge: 3 * 60 * 60 * 1000
            })
        }
        const http = HttpResponseFactory.ok({ accessToken: result.accessToken })
        return res.status(http.statusCode).json(http.body)
    }
}

class CreateUserController {
    async createUser(req: Request, res: Response) {
        const { name, email, password, role } = req.body

        const ucReq = new CreateUserUseCaseRequest(name, email, password, role)
        const common = new CreateUserUseCaseCommon()
        const validate = new CreateUserUseCaseValidate()
        const repository = new CreateUserUseCaseRepository()

        const usecase = new CreateUserUseCase(common, repository, validate)

        const ucRes = await usecase.createUser(ucReq)

        if (ucRes.error) {
            const http = HttpErrorMapper.map(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }
        const http = HttpResponseFactory.created(ucRes.user)
        return res.status(http.statusCode).json(http.body)
    }
}

export {
    LoginController,
    CreateUserController
}