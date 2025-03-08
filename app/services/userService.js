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

        const comparedPassword = await Bcrypt.comparePasswords(password, existingUser.password);
        if (!comparedPassword) {
            logger.error({
                message: 'Password is incorrect',
            });
            return template.badRequest("Password is incorrect");
        }

        const role = await userRoleRepository.findByUserId({userId:existingUser.id})
        console.log(role)
        if (!role) {
            logger.error({
                message: 'Role not found',
            });
            return template.badRequest("Role not found");
        }

        const token = jwtToken.generateToken({id:existingUser.id,role:role.role, is_verified:existingUser.is_verified})

        return template.success({token}, "Login successfully");

    } catch (e) {
        logger.error({
            message: 'Error login user',
            error: e.message,
        });
        return template.internalServerError();
    }
}
module.exports = {
     createUser,loginUser
}