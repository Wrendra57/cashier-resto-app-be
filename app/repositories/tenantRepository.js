const {Tenants} = require("../models")
const {sequelize} = require("../models/index.js");
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

const list = async ({limit, offset, transaction=null}) => {
    try{
        const options = {}
        if (transaction){
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }
        const query = `SELECT * FROM tenants WHERE deleted_at IS NULL ORDER BY name ASC LIMIT :limit OFFSET :offset;
        `;

        let tenants = await sequelize.query(query,{
            replacements: {limit, offset},
            type: sequelize.QueryTypes.SELECT,
            ...options})
        logger.info({
            message: "Tenants list retrieved successfully from the database",
            tenants: tenants,
        })
        return tenants;
    } catch (e) {
        logger.error({
            message: 'Database query error in list() tenantRepository',
            error: e.message,
        });
        throw new Error("Database query error: " + e.message);
    }
}
module.exports = {insert, list}