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

module.exports = {createTenant}