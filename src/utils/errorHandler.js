
function errorResponseHandler(args) {
    const { res, message, status, statusCode } = args
    return res.status(statusCode || 500).json({
        status,
        code: statusCode ? statusCode : 500,
        message: message || 'something went wrong'
    })
}


function globalErrorHandler(err, req, res, next) {
    const { message, statusCode, name, status } = err
    if (name === 'TokenExpiredError') {
        let statusCode = 401
        return errorResponseHandler({ res, name, message, status, statusCode })
    }
    return errorResponseHandler({ res, name, message, status, statusCode })
}


module.exports = { globalErrorHandler };