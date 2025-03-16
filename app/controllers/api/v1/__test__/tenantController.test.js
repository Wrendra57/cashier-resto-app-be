const tenantService = require('../../../../services/tenantService');
const { toTemplateResponseApi } = require('../../../../utils/template/templateResponeApi');
const { createTenant } = require('../tenantController');

jest.mock('../../../../services/tenantService');
jest.mock('../../../../utils/template/templateResponeApi');

describe('Tenant Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                nameTenant: 'Test Tenant',
                addressTenant: '123 Test St',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTenant', () => {
        it('should create a tenant successfully', async () => {
            const tenantResponse = { code: 201, message: 'Tenant created successfully', data: { id: '123' } };
            tenantService.createTenant.mockResolvedValue(tenantResponse);
            toTemplateResponseApi.mockReturnValue(tenantResponse);

            await createTenant(req, res);

            expect(tenantService.createTenant).toHaveBeenCalledWith({
                nameTenant: req.body.nameTenant,
                addressTenant: req.body.addressTenant,
            });
            expect(res.status).toHaveBeenCalledWith(tenantResponse.code);
            expect(res.json).toHaveBeenCalledWith(toTemplateResponseApi(tenantResponse));
        });

        it('should handle error during tenant creation', async () => {
            const tenantResponse = { code: 500, message: 'Internal Server Error' };
            tenantService.createTenant.mockResolvedValue(tenantResponse);
            toTemplateResponseApi.mockReturnValue(tenantResponse);

            await createTenant(req, res);

            expect(tenantService.createTenant).toHaveBeenCalledWith({
                nameTenant: req.body.nameTenant,
                addressTenant: req.body.addressTenant,
            });
            expect(res.status).toHaveBeenCalledWith(tenantResponse.code);
            expect(res.json).toHaveBeenCalledWith(toTemplateResponseApi(tenantResponse));
        });
    });
});