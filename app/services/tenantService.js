const tenantRepository = require('../repositories/tenantRepository')
const createLogger = require('../utils/logger')
const logger = createLogger(__filename)
const template = require('../utils/template/templateResponeApi')

const createTenant = async ({nameTenant,addressTenant})=>{
    try {
        const tenant= {
            name: nameTenant,
            address: addressTenant
        }
        const createdTenant = await tenantRepository.insert({params:tenant});
        logger.info({
            message: "Tenant created successfully",
            tenantId: createdTenant.id,
        });
        return template.created(createdTenant, "Tenant created successfully");

    } catch (e) {
        logger.error({
            message: 'Error creating tenant',
            error: e.message,
        });
        return template.internalServerError();
    }
}

const listTenants = async ({limit,page})=>{
    try {
        const tenants = await tenantRepository.list({limit:limit,offset:(page-1)*limit});
        logger.info({
            message: "Tenants list retrieved successfully",
            tenants: tenants,
        });
        return template.success(tenants, "Tenants list retrieved successfully");
    } catch (e) {
        logger.error({
            message: 'Error creating tenant',
            error: e.message,
        });
        return template.internalServerError();
    }
}

module.exports = {createTenant,listTenants}