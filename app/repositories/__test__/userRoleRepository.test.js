const { sequelize } = require("../../models/index.js");
const { UserRole } = require("../../models");
const { Error } = require("sequelize");
const { insert,findByUserId } = require("../userRoleRepository");

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
describe('unit test function in userRoleRepository', () => {


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

    describe('unit test findByUserId function in userRoleRepository', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const mockUserRole = [{
            user_id: 'fb728f79-ce38-4857-9595-7abb152603cf',
            roles: ['admin', 'user']
        }];

        const transaction = {
            LOCK: {
                UPDATE: 'UPDATE'
            }
        };

        const normalizeWhitespace = (str) => str.replace(/\s+/g, ' ').trim();

        it('should return user role when user role is found by userId', async () => {
            sequelize.query.mockResolvedValue(mockUserRole);

            const userId = 'fb728f79-ce38-4857-9595-7abb152603cf';
            const result = await findByUserId({ userId, transaction });

            expect(result).toEqual(mockUserRole[0]);
            expect(normalizeWhitespace(sequelize.query.mock.calls[0][0])).toBe(normalizeWhitespace(
                `SELECT
                ur.user_id,
                ARRAY_AGG(ur.role) AS roles
            FROM user_role ur
            WHERE ur.user_id = :userId
            GROUP BY ur.user_id
            LIMIT 1;`
            ));
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should return null when user role is not found by userId', async () => {
            sequelize.query.mockResolvedValue([]);

            const userId = 'notfound-user-id';
            const result = await findByUserId({ userId, transaction });

            expect(result).toBeNull();
            expect(normalizeWhitespace(sequelize.query.mock.calls[0][0])).toBe(normalizeWhitespace(
                `SELECT
                ur.user_id,
                ARRAY_AGG(ur.role) AS roles
            FROM user_role ur
            WHERE ur.user_id = :userId
            GROUP BY ur.user_id
            LIMIT 1;`
            ));
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should throw error when database query fails', async () => {
            const errorMessage = 'Database query error';
            sequelize.query.mockRejectedValue(new Error(errorMessage));

            const userId = 'error-user-id';

            await expect(findByUserId({ userId, transaction })).rejects.toThrow(`Database query error: ${errorMessage}`);
            expect(normalizeWhitespace(sequelize.query.mock.calls[0][0])).toBe(normalizeWhitespace(
                `SELECT
                ur.user_id,
                ARRAY_AGG(ur.role) AS roles
            FROM user_role ur
            WHERE ur.user_id = :userId
            GROUP BY ur.user_id
            LIMIT 1;`
            ));
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should handle transaction being null', async () => {
            sequelize.query.mockResolvedValue(mockUserRole);

            const userId = 'fb728f79-ce38-4857-9595-7abb152603cf';
            const result = await findByUserId({ userId });

            expect(result).toEqual(mockUserRole[0]);
            expect(normalizeWhitespace(sequelize.query.mock.calls[0][0])).toBe(normalizeWhitespace(
                `SELECT
                ur.user_id,
                ARRAY_AGG(ur.role) AS roles
            FROM user_role ur
            WHERE ur.user_id = :userId
            GROUP BY ur.user_id
            LIMIT 1;`
            ));
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });
    });
})