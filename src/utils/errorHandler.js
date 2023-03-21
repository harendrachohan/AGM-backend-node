
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

function AppError(message, statusCode, next) {    
    let status = `${statusCode}`.startsWith('4') ? false : 'error';    
    return {
        status: status,
        message, message,
        statusCode, statusCode
    }
}


module.exports = { globalErrorHandler, AppError};