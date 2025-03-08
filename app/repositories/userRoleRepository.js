const {sequelize} = require("../models/index.js");
const {UserRole} = require("../models")
const createLogger = require("../utils/logger")
const logger = createLogger(__filename)

const insert = async ({params, transaction=null}) => {
  try {
      const options = {}
      if (transaction){
          options.transaction = transaction;
          options.lock = transaction.LOCK.UPDATE
      }
      let userRole = await UserRole.create(params,options);
        logger.info({
            message: "User Role inserted successfully to the database",
            userId: userRole.id,
            userRole
        })
      return userRole;
  } catch (error) {
      logger.error({
          message: 'Database query error',
          error: error.message,
          params
      });
      throw new Error("Database query error: " + error.message);
  }
}

module.exports = {
    insert
}