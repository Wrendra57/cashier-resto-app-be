const {sequelize} = require("../models/index.js");
const {Tenants} = require("../models")
const createLogger = require("../utils/logger")
const logger = createLogger(__filename)

const insert = async ({params, transaction=null}) => {
    try{
        const options = {}
        if (transaction){
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }
        let tenant = await Tenants.create(params,options);
        logger.info({
            message: "Tenant inserted successfully to the database",
            tenantId: tenant.id,
        })
        return tenant;
    } catch (e) {
        logger.error({
            message: 'Database query error in insert() tenantRepository',
            error: e.message,
        });
        throw new Error("Database query error: " + e.message);
    }
}
module.exports = {insert}