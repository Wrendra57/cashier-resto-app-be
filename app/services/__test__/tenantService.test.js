const tenantRepository = require('../../repositories/tenantRepository');
const template = require('../../utils/template/templateResponeApi');
const { createTenant } = require('../tenantService');

jest.mock('../../repositories/tenantRepository');
jest.mock('../../utils/template/templateResponeApi');

describe('Tenant Service', () => {
       afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTenant', () => {
        it('should create a tenant successfully', async () => {
            const tenant = { name: 'Test Tenant', address: '123 Test St' };
            const createdTenant = { id: '123', ...tenant };
            tenantRepository.insert.mockResolvedValue(createdTenant);
            template.created.mockReturnValue({ status: 201, message: 'Tenant created successfully', data: createdTenant });

            const result = await createTenant({ nameTenant: tenant.name, addressTenant: tenant.address });

            expect(tenantRepository.insert).toHaveBeenCalledWith({ params: tenant });
            expect(result).toEqual({ status: 201, message: 'Tenant created successfully', data: createdTenant });
        });

        it('should handle error during tenant creation', async () => {
            const tenant = { name: 'Test Tenant', address: '123 Test St' };
            const errorMessage = 'Database query error';
            tenantRepository.insert.mockRejectedValue(new Error(errorMessage));
            template.internalServerError.mockReturnValue({ status: 500, message: 'Internal Server Error' });

            const result = await createTenant({ nameTenant: tenant.name, addressTenant: tenant.address });

            expect(tenantRepository.insert).toHaveBeenCalledWith({ params: tenant });
            expect(result).toEqual({ status: 500, message: 'Internal Server Error' });
        });
    });
});