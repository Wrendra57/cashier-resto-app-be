const {sequelize} = require("../models/index.js");
const models = require("../models/index.js")
const User = models.User;
const createLogger = require("../utils/logger")
const logger = createLogger(__filename)

const insert = async ({params, transaction=null})=>{
    try{
        const options = {}
        if (transaction){
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }
        let user = await User.create(params,options);
        logger.info({
            message: "User inserted successfully to the database",
            userId: user.id,
            params
        })
        return user;
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
            params
        });
        throw new Error("Database query error: " + error.message);
    }
}

const findByEmail = async ({email,transaction=null})=>{
    try {
        const options = {};
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE;
        }
        const query = 'SELECT * FROM users WHERE email = :email';
        const user = await sequelize.query(query, {
            replacements: { email },
            type: sequelize.QueryTypes.SELECT,
            ...options
        });
        if (user.length > 0) {
            logger.info({
                message: "User found successfully in the database",
                userId: user[0].id,
                email
            });
            return user[0];
        } else {
            logger.warn({
                message: "User not found in the database",
                email
            });
            return null;
        }
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
            email
        });
        throw new Error("Database query error: " + error.message);
    }
}

const findById = async ({id,transaction=null})=>{
    try {
        const options = {};
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE;
        }
        const query = 'SELECT * FROM users WHERE id = :id';
        const user = await sequelize.query(query, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
            ...options
        });
        if (user.length > 0) {
            logger.info({
                message: "User found successfully in the database",
                userId: user[0].id,
            });
            return user[0];
        } else {
            logger.warn({
                message: "User not found in the database",
            });
            return null;
        }
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
        });
        throw new Error("Database query error: " + error.message);
    }
}

const findByPhoneNumber  = async ({phoneNumber,transaction=null})=>{
    try {
        const options = {};
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE;
        }
        const query = 'SELECT * FROM users WHERE phone_number = :phoneNumber';
        const user = await sequelize.query(query, {
            replacements: { phoneNumber },
            type: sequelize.QueryTypes.SELECT,
            ...options
        });

        if (user.length > 0) {
            logger.info({
                message: "User found successfully in the database",
                userId: user[0].id,
                phoneNumber
            });
            return user[0];
        } else {
            logger.warn({
                message: "User not found in the database",
                phoneNumber
            });
            return null;
        }
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
            phoneNumber
        });
        throw new Error("Database query error: " + error.message);
    }
}

const findByEmailOrPhoneNumber = async ({params,transaction=null})=>{
    try {
        const options = {};
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE;
        }
        const query = 'SELECT * FROM users WHERE email = :params or phone_number = :params';

        const user = await sequelize.query(query, {
            replacements: { params },
            type: sequelize.QueryTypes.SELECT,
            ...options
        });

        if (user.length > 0) {
            logger.info({
                message: "User found successfully in the database",
                userId: user[0].id,
            });
            return user[0];
        } else {
            logger.warn({
                message: "User not found in the database",
                params,
            });
            return null;
        }
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
            params
        });
        throw new Error("Database query error: " + error.message);
    }
}
module.exports={insert,findByEmail,findByPhoneNumber,findByEmailOrPhoneNumber,findById}