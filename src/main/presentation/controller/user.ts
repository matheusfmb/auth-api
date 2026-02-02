import { CreateUserUseCaseRequest, CreateUserUseCaseResponse, GetUserByIDUseCaseRequest, LoginUserUseCaseRequest } from "../../core/usecase/ucio/user"
import { CreateUserUseCaseValidate, GetUserByIDUseCaseValidate, LoginUserUseCaseValidate } from "../../infra/provider/validate/user"
import { CreateUserUseCaseCommon, GetUserByIDUseCaseCommon, LoginUserUseCaseCommon } from "../../infra/provider/common/user"
import { Request, Response } from 'express'
import { CreateUserUseCaseRepository, GetUserByIDUseCaseRepository, LoginUserUseCaseRepository } from "../../infra/provider/repository/user"
import { CreateUserUseCase, GetUserByIDUseCase, LoginUserUseCase } from "../../core/usecase/user"
import { mapErrorToHttp } from "../http/http_mappers"
import { HttpResponseFactory } from "../http/http_response"

class LoginController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body

        const ucReq = new LoginUserUseCaseRequest(email, password)
        const common = new LoginUserUseCaseCommon()
        const validate = new LoginUserUseCaseValidate()
        const repository = new LoginUserUseCaseRepository()

        const usecase = new LoginUserUseCase(common, repository, validate)

        const ucRes = await usecase.login(ucReq)

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
    async createUser(req: Request, res: Response) {
        const { name, email, password, role } = req.body

        const ucReq = new CreateUserUseCaseRequest(name, email, password, role)
        const common = new CreateUserUseCaseCommon()
        const validate = new CreateUserUseCaseValidate()
        const repository = new CreateUserUseCaseRepository()

        const usecase = new CreateUserUseCase(common, repository, validate)

        const ucRes = await usecase.createUser(ucReq)

        if (ucRes.error) {
            const http = mapErrorToHttp(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }
        const http = HttpResponseFactory.created(ucRes.user)
        return res.status(http.statusCode).json(http.body)
    }
}

class GetUserByIDController {
    async getUserByID(req: Request, res: Response) {
        const { userID } = req.params

        const ucReq = new GetUserByIDUseCaseRequest(userID)
        const common = new GetUserByIDUseCaseCommon()
        const validate = new GetUserByIDUseCaseValidate()
        const repository = new GetUserByIDUseCaseRepository()   
        
        const usecase = new GetUserByIDUseCase(common, repository, validate)

        const ucRes = await usecase.getUserByID(ucReq)  
       if (ucRes.error) {
            const http = mapErrorToHttp(ucRes.error)
            return res.status(http.statusCode).json(http.body)
        }
        const http = HttpResponseFactory.ok(ucRes.user)
        return res.status(http.statusCode).json(http.body)
    }
}

export {
    LoginController,
    CreateUserController,
    GetUserByIDController
}