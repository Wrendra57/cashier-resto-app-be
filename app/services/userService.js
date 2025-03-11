const createdLogger = require('../utils/logger')
const logger = createdLogger(__filename)
const userRepository= require("../repositories/userRepository");
const userRoleRepository= require("../repositories/userRoleRepository");
const sequelize = require('../models').sequelize
const {badRequest, success, internalServerError} = require("../utils/template/templateResponeApi");

const ROLE_HIERARCHY = {
    superadmin: ["superadmin", "admin", "user"],
    admin: ["admin", "user"],
    user: ["user"]
};

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

const updateRoles = async ({userId,newRole}) => {
    const transaction = await sequelize.transaction();
    try {
        const existingUser = await userRepository.findById({id:userId,transaction});
        if (!existingUser) {
            logger.error({
                message: 'User not found',
            });
            await transaction.rollback();
            return badRequest("User not found");
        }
        const currentRoles = await userRoleRepository.findByUserId({userId,transaction})

        if (currentRoles.roles.length===0){
            logger.error({
                message: 'Role not found',
            });
            await transaction.rollback();
            return badRequest("Role not found");
        }

        const newRoles = ROLE_HIERARCHY[newRole] || [];

        const rolesToAdd = newRoles.filter(role => !currentRoles.roles.includes(role));

        const rolesToRemove = currentRoles.roles.filter(role => !newRoles.includes(role));

        if (rolesToAdd.length === 0 && rolesToRemove.length === 0) {
            logger.error({
                message: 'No changes in roles',
            })
            await transaction.rollback();
            return badRequest("No changes in roles");
        }
        if (rolesToAdd.length>0){
            for (let i = 0; i<rolesToAdd.length;i++){
                await userRoleRepository.insert({params:{user_id:userId,role:rolesToAdd[i]},transaction});
            }
        }
        if (rolesToRemove.length>0){
            for (let i = 0; i<rolesToRemove.length;i++){
                await userRoleRepository.deleteByUserIdAndRole({userId,role:rolesToRemove[i],transaction});
            }
        }

        await transaction.commit()
        return success({role: newRoles}, "User roles updated successfully");
    } catch (e) {
        await transaction.rollback();
        logger.error({
            message: 'Error verify user',
            error: e.message,
        });
        return internalServerError();
    }
}

module.exports = {verifyUser,updateRoles};