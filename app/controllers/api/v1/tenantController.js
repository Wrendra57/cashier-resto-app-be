const tenantService = require('../../../services/tenantService')
const {toTemplateResponseApi} = require("../../../utils/template/templateResponeApi");

const createTenant = async (req, res) => {
    const { nameTenant, addressTenant } = req.body;
    const tenant = await tenantService.createTenant({ nameTenant, addressTenant });

    return res.status(tenant.code).json(toTemplateResponseApi(tenant));
}

module.exports = {createTenant}