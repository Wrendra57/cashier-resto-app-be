const { sequelize } = require("../../models/index.js");
const { Tenants } = require("../../models");
const { Error } = require("sequelize");
const { insert,findByUserId,deleteByUserIdAndRole} = require("../tenantRepository");

jest.mock('../../models/index.js', () => {
    const actualSequelize = jest.requireActual('sequelize');
    const SequelizeMock = jest.fn(() => ({
        query: jest.fn(),
        QueryTypes: actualSequelize.QueryTypes
    }));
    SequelizeMock.Sequelize = actualSequelize.Sequelize;
    return {
        sequelize: new SequelizeMock(),
        Sequelize: actualSequelize.Sequelize,
        Tenants: {
            create: jest.fn()
        }
    };
});

describe('unit test for function un tenant repository', () => {
        describe('insert', () => {
            afterEach(() => {
                jest.clearAllMocks();
            });
            it('should insert a tenant successfully', async () => {
                const params = { name: 'Test Tenant', address: '123 Test St' };
                const tenant = { id: '123', ...params };
                Tenants.create.mockResolvedValue(tenant);

                const result = await insert({ params });

                expect(Tenants.create).toHaveBeenCalledWith(params, {});
                expect(result).toEqual(tenant);
            });

            it('should insert a tenant successfully with transaction', async () => {
                const params = { name: 'Test Tenant', address: '123 Test St' };
                const tenant = { id: '123', ...params };
                const transaction = { LOCK: { UPDATE: 'UPDATE' } };
                Tenants.create.mockResolvedValue(tenant);

                const result = await insert({ params, transaction });

                expect(Tenants.create).toHaveBeenCalledWith(params, { transaction, lock: transaction.LOCK.UPDATE });
                expect(result).toEqual(tenant);
            });

            it('should log an error and throw an error if insertion fails', async () => {
                const params = { name: 'Test Tenant', address: '123 Test St' };
                const errorMessage = 'Insertion error';
                Tenants.create.mockRejectedValue(new Error(errorMessage));

                await expect(insert({ params })).rejects.toThrow(`Database query error: ${errorMessage}`);
            });
        });
});