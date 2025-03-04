const {sequelize} = require("../models/index.js");
const models = require("../models/index.js")
const User = models.User;
const createLogger = require("../utils/logger")
const logger = createLogger(__filename)

const insert = async (params)=>{
    try{
        let user = await User.create(params);
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

module.exports={insert}