function parseDateFromString(dateString: string): Date {
  const date = new Date(dateString)
  return date
}

function newDate() {
  const date = new Date()
  if (date.getTimezoneOffset() === 0) {
    const dto = 180 * 60000

    return new Date(date.getTime() - dto)
  }

  return date
}

export {
  parseDateFromString,
  newDate
}