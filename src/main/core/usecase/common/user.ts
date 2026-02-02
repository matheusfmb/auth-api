interface LoginUserUseCaseCommonInterface {
    generateUUID(): string
    newDate(): Date
}

interface CreateUserUseCaseCommonInterface {
    generateUUID(): string
    newDate(): Date
}

export {
    LoginUserUseCaseCommonInterface,
    CreateUserUseCaseCommonInterface
}