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

const findByUserId = async ({userId, transaction=null}) => {
    try {
        const options = {};
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE;
        }
        const query = `SELECT 
                            ur.user_id,
                            ARRAY_AGG(ur.role) AS roles
                        FROM user_role ur
                        WHERE ur.user_id = :userId
                        GROUP BY ur.user_id
                        LIMIT 1;`
        const userRole = await sequelize.query(query, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT,
            ...options
        });
        if (userRole.length > 0) {
            logger.info({
                message: "User Role found successfully in the database",
                userId: userRole[0].id,
            });
            return userRole[0];
        } else {
            logger.warn({
                message: "User Role not found in the database",
                userId
            });
            return null;
        }
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
            userId
        });
        throw new Error("Database query error: " + error.message);
    }
}

const deleteByUserIdAndRole = async ({userId,role, transaction=null}) => {
    try {
        const options = {}
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE;
        }
        const query = `DELETE FROM user_role WHERE user_id = :userId AND role = :role;`
        await sequelize.query(query,{
            replacements: { userId,role },
            type: sequelize.QueryTypes.SELECT,
            ...options
        })
        logger.info({
            message: "User Role deleted successfully from the database",
            userId,
            role
        });
        return userId
    } catch (error) {
        logger.error({
            message: 'Database query error',
            error: error.message,
            userId
        });
        throw new Error("Database query error: " + error.message);
    }
}
module.exports = {
    insert,findByUserId,deleteByUserIdAndRole
}