let statusCode;
let status;

class AppError extends Error {

    constructor(message, statusCode) {
        super(message)
        this.status = `${statusCode}`.startsWith('4') ? false : 'error'
        this.statusCode = statusCode
    }
}

module.exports = AppError;