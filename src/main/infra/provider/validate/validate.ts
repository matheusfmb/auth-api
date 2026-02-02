function checkStringEmpty(value: string): boolean {
    return !value || value.trim() === ""
}

export {
    checkStringEmpty
}