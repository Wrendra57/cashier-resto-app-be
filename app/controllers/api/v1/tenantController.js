const tenantService = require('../../../services/tenantService')
const {toTemplateResponseApi} = require("../../../utils/template/templateResponeApi");

const createTenant = async (req, res) => {
    const { nameTenant, addressTenant } = req.body;
    const tenant = await tenantService.createTenant({ nameTenant, addressTenant });

    return res.status(tenant.code).json(toTemplateResponseApi(tenant));
}

const listTenants = async (req, res) => {
    let limit = Number(req.query.limit) || 10;
    let page = Number(req.query.page) || 1;
    console.log(`limit == ${limit}, page ${page}`);
    const tenants = await tenantService.listTenants({ limit, page });

    return res.status(tenants.code).json(toTemplateResponseApi(tenants));
}

module.exports = {createTenant, listTenants}