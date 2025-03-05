const { sequelize } = require("../../models/index.js");
const { UserRole } = require("../../models");
const { Error } = require("sequelize");
const { insert } = require("../userRoleRepository");

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
        UserRole: {
            create: jest.fn()
        }
    };
});

describe('unit test insert function in userRoleRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockUserRole = {
        id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
        role: 'admin',
        userId: 'user123',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
    };

    const transaction = {
        LOCK: {
            UPDATE: 'UPDATE'
        }
    };

    it('should return userRole when insert userRole is successful', async () => {
        UserRole.create.mockResolvedValue(mockUserRole);

        const params = {
            role: 'admin',
            userId: 'user123'
        };

        const result = await insert({ params, transaction });

        expect(result).toEqual(mockUserRole);
        expect(UserRole.create).toBeCalledWith(params, { transaction, lock: transaction.LOCK.UPDATE });
        expect(UserRole.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when insert userRole fails', async () => {
        const errorMessage = 'Database query error';
        UserRole.create.mockRejectedValue(new Error(errorMessage));

        const params = {
            role: 'admin',
            userId: 'user123'
        };

        await expect(insert({ params, transaction })).rejects.toThrow(errorMessage);
        expect(UserRole.create).toBeCalledWith(params, { transaction, lock: transaction.LOCK.UPDATE });
        expect(UserRole.create).toHaveBeenCalledTimes(1);
    });

    it('should handle transaction being null', async () => {
        UserRole.create.mockResolvedValue(mockUserRole);

        const params = {
            role: 'admin',
            userId: 'user123'
        };

        const result = await insert({ params });

        expect(result).toEqual(mockUserRole);
        expect(UserRole.create).toBeCalledWith(params, {});
        expect(UserRole.create).toHaveBeenCalledTimes(1);
    });
});