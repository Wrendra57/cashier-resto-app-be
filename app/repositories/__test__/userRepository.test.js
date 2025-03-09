const { insert, findByEmail,findByPhoneNumber, findByEmailOrPhoneNumber } = require("../userRepository");
const { sequelize } = require("../../models/index.js");
const { User } = require("../../models");
const { Error } = require("sequelize");

// Mock
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
        User: {
            create: jest.fn()
        }
    };
});
describe('unit test in user repositories', () => {
    describe('unit test insert function in user repositories', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const mockUser = {
            id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
            name: 'usertest',
            email: 'test@test.com',
            password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
            phone_number: '628123456789',
            is_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
        };

        const transaction = {
            LOCK: {
                UPDATE: 'UPDATE'
            }
        };

        it('should return user when insert user success', async () => {
            User.create.mockResolvedValue(mockUser);

            const params = {
                name: 'usertest',
                email: 'test@test.com',
                password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
                phone_number: '628123456789',
            };

            const result = await insert({ params, transaction });

            expect(result).toEqual(mockUser);
            expect(User.create).toBeCalledWith(params, { transaction, lock: transaction.LOCK.UPDATE });
            expect(User.create).toHaveBeenCalledTimes(1);
        });

        it('should throw error when insert user fails', async () => {
            const errorMessage = 'Database query error';
            User.create.mockRejectedValue(new Error(errorMessage));

            const params = {
                name: 'usertest',
                email: 'test@test.com',
                password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
                phone_number: '628123456789',
            };

            await expect(insert({ params, transaction })).rejects.toThrow(`Database query error: ${errorMessage}`);
            expect(User.create).toBeCalledWith(params, { transaction, lock: transaction.LOCK.UPDATE });
            expect(User.create).toHaveBeenCalledTimes(1);
        });

        it('should handle transaction being null', async () => {
            User.create.mockResolvedValue(mockUser);

            const params = {
                name: 'usertest',
                email: 'test@test.com',
                password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
                phone_number: '628123456789',
            };

            const result = await insert({ params });

            expect(result).toEqual(mockUser);
            expect(User.create).toBeCalledWith(params, {});
            expect(User.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('unit test findByEmail function in user repositories', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const mockUser = [{
            id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
            name: 'usertest',
            email: 'test@test.com',
            password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
            phone_number: '628123456789',
            is_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
        }];

        const transaction = {
            LOCK: {
                UPDATE: 'UPDATE'
            }
        };

        it('should return user when user is found', async () => {
            sequelize.query.mockResolvedValue(mockUser);

            const email = 'test@test.com';
            const result = await findByEmail({ email, transaction });

            expect(result).toEqual(mockUser[0]);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should return null when user is not found', async () => {
            sequelize.query.mockResolvedValue([]);

            const email = 'notfound@test.com';
            const result = await findByEmail({ email, transaction });

            expect(result).toBeNull();
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should throw error when database query fails', async () => {
            const errorMessage = 'Database query error';
            sequelize.query.mockRejectedValue(new Error(errorMessage));

            const email = 'error@test.com';

            await expect(findByEmail({ email, transaction })).rejects.toThrow(`Database query error: ${errorMessage}`);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should handle transaction being null', async () => {
            sequelize.query.mockResolvedValue(mockUser);

            const email = 'test@test.com';
            const result = await findByEmail({ email });

            expect(result).toEqual(mockUser[0]);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('unit test findByPhoneNumber function in user repositories', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const mockUser = [{
            id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
            name: 'usertest',
            email: 'test@test.com',
            password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
            phone_number: '628123456789',
            is_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
        }];

        const transaction = {
            LOCK: {
                UPDATE: 'UPDATE'
            }
        };

        it('should return user when user is found', async () => {
            sequelize.query.mockResolvedValue(mockUser);

            const phoneNumber = '628123456789';
            const result = await findByPhoneNumber({ phoneNumber, transaction });

            expect(result).toEqual(mockUser[0]);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE phone_number = :phoneNumber',
                {
                    replacements: { phoneNumber },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should return null when user is not found', async () => {
            sequelize.query.mockResolvedValue([]);

            const phoneNumber = '0000000000';
            const result = await findByPhoneNumber({ phoneNumber, transaction });

            expect(result).toBeNull();
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE phone_number = :phoneNumber',
                {
                    replacements: { phoneNumber },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should throw error when database query fails', async () => {
            const errorMessage = 'Database query error';
            sequelize.query.mockRejectedValue(new Error(errorMessage));

            const phoneNumber = 'errorPhoneNumber';

            await expect(findByPhoneNumber({ phoneNumber, transaction })).rejects.toThrow(`Database query error: ${errorMessage}`);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE phone_number = :phoneNumber',
                {
                    replacements: { phoneNumber },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should handle transaction being null', async () => {
            sequelize.query.mockResolvedValue(mockUser);

            const phoneNumber = '628123456789';
            const result = await findByPhoneNumber({ phoneNumber });

            expect(result).toEqual(mockUser[0]);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE phone_number = :phoneNumber',
                {
                    replacements: { phoneNumber },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('unit test findByEmailOrPhoneNumber function in user repositories', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const mockUser = [{
            id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
            name: 'usertest',
            email: 'test@test.com',
            password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
            phone_number: '628123456789',
            is_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
        }];

        const transaction = {
            LOCK: {
                UPDATE: 'UPDATE'
            }
        };

        it('should return user when user is found by email or phone number', async () => {
            sequelize.query.mockResolvedValue(mockUser);

            const params = 'test@test.com';
            const result = await findByEmailOrPhoneNumber({ params, transaction });

            expect(result).toEqual(mockUser[0]);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :params or phone_number = :params',
                {
                    replacements: { params },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should return null when user is not found by email or phone number', async () => {
            sequelize.query.mockResolvedValue([]);

            const params = 'notfound@test.com';
            const result = await findByEmailOrPhoneNumber({ params, transaction });

            expect(result).toBeNull();
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :params or phone_number = :params',
                {
                    replacements: { params },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should throw error when database query fails', async () => {
            const errorMessage = 'Database query error';
            sequelize.query.mockRejectedValue(new Error(errorMessage));

            const params = 'error@test.com';

            await expect(findByEmailOrPhoneNumber({ params, transaction })).rejects.toThrow(`Database query error: ${errorMessage}`);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :params or phone_number = :params',
                {
                    replacements: { params },
                    type: sequelize.QueryTypes.SELECT,
                    transaction,
                    lock: transaction.LOCK.UPDATE
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });

        it('should handle transaction being null', async () => {
            sequelize.query.mockResolvedValue(mockUser);

            const params = 'test@test.com';
            const result = await findByEmailOrPhoneNumber({ params });

            expect(result).toEqual(mockUser[0]);
            expect(sequelize.query).toBeCalledWith(
                'SELECT * FROM users WHERE email = :params or phone_number = :params',
                {
                    replacements: { params },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            expect(sequelize.query).toHaveBeenCalledTimes(1);
        });
    });
})