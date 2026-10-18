// Error propio para poder leer el estado HTTP y los errores por campo (422).
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}
