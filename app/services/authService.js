const userRepository = require("../repositories/userRepository")
const userRoleRepository = require("../repositories/userRoleRepository")
const createdLogger = require("../utils/logger")
const logger = createdLogger(__filename)
const template = require('../utils/template/templateResponeApi')
const sequelize = require('../models').sequelize
const Bcrypt = require('../utils/converter/bcrypt')
const jwtToken = require('../utils/converter/jwtToken')

const createUser = async (params) => {
    const transaction = await sequelize.transaction();
    try {
        const user = {
            name: params.name,
            email: params.email,
            password: await Bcrypt.encodedPassword(params.password),
            phone_number: params.phone_number,
        };

        const existingUser = await userRepository.findByEmail({ email: user.email, transaction });
        if (existingUser) {
            await transaction.rollback();
            logger.error({
                message: 'Email or phone number already exists',
                email: user.email,
            });
            return template.badRequest("Email or phone number already exists");
        }

        const existingUserByPhone = await userRepository.findByPhoneNumber({ phoneNumber: user.phone_number, transaction });
        if (existingUserByPhone) {
            await transaction.rollback();
            logger.error({
                message: 'Email or phone number already exists',
                phone_number: user.phone_number,
            });
            return template.badRequest("Email or phone number already exists");
        }


        const createdUser = await userRepository.insert({ params: user, transaction });
        user.id = createdUser.id;
        logger.info({
            message: "User created successfully",
            userId: user.id,
        });

        const userRoleParams = { user_id: user.id, role: "user" };
        const userRole = await userRoleRepository.insert({ params: userRoleParams, transaction });
        logger.info({
            message: "User Role created successfully",
            userId: userRole.id,
        });

        await transaction.commit();
        return template.created({id:user.id}, "User created successfully");
    } catch (error) {
        await transaction.rollback();
        logger.error({
            message: 'Error creating user',
            error: error.message,
        });
        return template.internalServerError();
    }
};

const loginUser = async ({emailOrPhoneNumber, password}) =>{
    try {
        const existingUser = await userRepository.findByEmailOrPhoneNumber({ params: emailOrPhoneNumber });
        if (!existingUser) {
            logger.error({
                message: 'Email or phone number not found',
            });
            return template.badRequest("Email or phone number not found");
        }
        if (existingUser.is_verified===false){
            logger.error({
                message: 'Account not verified',
            });
            return template.badRequest("Account not verified");
        }

        const comparedPassword = await Bcrypt.comparePasswords(password, existingUser.password);
        if (!comparedPassword) {
            logger.error({
                message: 'Password is incorrect',
            });
            return template.badRequest("Password is incorrect");
        }

        const role = await userRoleRepository.findByUserId({userId:existingUser.id})
        if (!role) {
            logger.error({
                message: 'Role not found',
            });
            return template.badRequest("Role not found");
        }

        const token = jwtToken.generateToken({id:existingUser.id,role:role.roles, is_verified:existingUser.is_verified})

        return template.success({token}, "Login successfully");

    } catch (e) {
        logger.error({
            message: 'Error login user',
            error: e.message,
        });
        return template.internalServerError();
    }
}

const findById = async (id) =>{
    try {
        const existingUser = await userRepository.findById({ id:id });
        if (!existingUser) {
            logger.error({
                message: 'User not found',
            });
            return template.badRequest("User not found");
        }
        const userRole = await userRoleRepository.findByUserId({userId:id});
        if (!userRole) {
            logger.error({
                message: 'Role not found',
            });
            return template.badRequest("Role not found");
        }
        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone_number: existingUser.phone_number,
            is_verified:existingUser.is_verified,
            created_at: existingUser.created_at,
            updated_at: existingUser.updated_at,
            deleted_at: existingUser.deleted_at,
            role: userRole.roles
        }
        return template.success(user, "User found");
    } catch (e) {
        logger.error({
            message: 'Error find by id user',
            error: e.message,
        });
        return template.internalServerError();
    }
}
module.exports = {
     createUser,loginUser,findById
}