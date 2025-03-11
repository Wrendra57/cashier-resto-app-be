const createdLogger = require('../utils/logger')
const logger = createdLogger(__filename)
const userRepository= require("../repositories/userRepository");
const {badRequest, success, internalServerError} = require("../utils/template/templateResponeApi");

const verifyUser = async ({isVerified,userId}) => {
    try {
        const existingUser = await userRepository.findById({id:userId});
        if (!existingUser) {
            logger.error({
                message: 'User not found',
            });
            return badRequest("User not found");
        }
        // update user
        const params = {
            is_verified:isVerified,
        }
        await userRepository.update({id:userId, params:params});
        logger.info({
                message: 'User verify updated successfully',
            })
        return success({id:userId}, "User verify updated successfully");
    } catch (e) {
        logger.error({
            message: 'Error verify user',
            error: e.message,
        });
        return internalServerError();
    }
}

module.exports = {verifyUser};