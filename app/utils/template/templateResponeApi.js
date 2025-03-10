
const toTemplateResponseApi=(params)=>{
    return {
        status: params.status,
        message: params.message,
        data: params.data
    }
}
const internalServerError = ()=>{
    return {
        code:500,
        status: "Error",
        message: "Internal Server Error",
        data: null
    }
}
const unauthorizedError = (message)=>{
    return {
        code:401,
        status: "Unauthorized",
        message: message,
        data: null
    }
}
const forbiddenError = (message)=>{
    return {
        code:403,
        status: "Forbidden",
        message: message,
        data: null
    }
}
const success = ( data, message)=>{
    return {
        code:200,
        status: "Success",
        message: message,
        data: data
    }
}
const created = ( data, message)=>{
    return {
        code:201,
        status: "Success",
        message: message,
        data: data
    }
}
const badRequest = ( message)=>{
    return {
        code:400,
        status: "Failed",
        message: message,
        data: null
    }
}
module.exports = {toTemplateResponseApi,success,created,internalServerError,badRequest,unauthorizedError, forbiddenError}