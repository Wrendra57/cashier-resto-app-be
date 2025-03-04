const userRepository = require("../repositories/userRepository")
const createdLogger = require("../utils/logger")
const logger = createdLogger(__filename)
const template = require('../utils/template/templateResponeApi')

const createUser = async (params)=>{
    try{
        const user = await userRepository.insert(params);
        logger.info({
            message: "User created successfully",
            userId: user.id,
        });
        return template.created(user, "User created successfully");
    } catch (error) {
        logger.error({
            message: 'Error creating user',
            error: error.message,
        });
        return template.internalServerError();
    }
}

module.exports = {
    createUser
}