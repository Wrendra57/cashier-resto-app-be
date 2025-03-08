const userRepository = require('../../repositories/userRepository')
const userRoleRepository = require('../../repositories/userRoleRepository')
const {createUser} = require('../userService')
const sequelize = require('../../models').sequelize
const Bcrypt = require('../../utils/converter/bcrypt');
const template = require('../../utils/template/templateResponeApi');

jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/userRoleRepository');
jest.mock('../../models');
jest.mock('../../utils/converter/bcrypt');
jest.mock('../../utils/template/templateResponeApi');

describe('unit test createUser function in userService', () => {
    let transaction;

    beforeEach(() => {
        transaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
            LOCK: {
                UPDATE: 'UPDATE'
            }
        };
        sequelize.transaction.mockResolvedValue(transaction);
    });

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

    const mockUserRole = {
        id: 'role123',
        role: 'user',
        userId: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
    };

    it('should create user and user role successfully', async () => {
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.findByPhoneNumber.mockResolvedValue(null);
        userRepository.insert.mockResolvedValue(mockUser);
        userRoleRepository.insert.mockResolvedValue(mockUserRole);
        Bcrypt.encodedPassword.mockResolvedValue(mockUser.password);
        template.created.mockReturnValue({ status: 201, message: 'User created successfully', data: mockUser.id });

        const params = {
            name: 'usertest',
            email: 'test@test.com',
            password: 'password123',
            phone_number: '628123456789'
        };

        const result = await createUser(params);

        expect(result).toEqual({ status: 201, message: 'User created successfully', data: mockUser.id });
        expect(userRepository.findByEmail).toHaveBeenCalledWith({ email: params.email, transaction });
        expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith({ phoneNumber: params.phone_number, transaction });
        expect(userRepository.insert).toHaveBeenCalledWith({ params: expect.objectContaining({ email: params.email }), transaction });
        expect(userRoleRepository.insert).toHaveBeenCalledWith({ params: expect.objectContaining({ user_id: mockUser.id }), transaction });
        expect(transaction.commit).toHaveBeenCalled();
    });

    it('should return bad request if email already exists', async () => {
        userRepository.findByEmail.mockResolvedValue(mockUser);
        template.badRequest.mockReturnValue({ status: 400, message: 'User already exists' });

        const params = {
            name: 'usertest',
            email: 'test@test.com',
            password: 'password123',
            phone_number: '628123456789'
        };

        const result = await createUser(params);

        expect(result).toEqual({ status: 400, message: 'User already exists' });
        expect(userRepository.findByEmail).toHaveBeenCalledWith({ email: params.email, transaction });
        expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should return bad request if phone number already exists', async () => {
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.findByPhoneNumber.mockResolvedValue(mockUser);
        template.badRequest.mockReturnValue({ status: 400, message: 'Phone number already exists' });

        const params = {
            name: 'usertest',
            email: 'test@test.com',
            password: 'password123',
            phone_number: '628123456789'
        };

        const result = await createUser(params);

        expect(result).toEqual({ status: 400, message: 'Phone number already exists' });
        expect(userRepository.findByEmail).toHaveBeenCalledWith({ email: params.email, transaction });
        expect(userRepository.findByPhoneNumber).toHaveBeenCalledWith({ phoneNumber: params.phone_number, transaction });
        expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should handle error during user creation', async () => {
        const errorMessage = 'Database query error';
        userRepository.findByEmail.mockRejectedValue(new Error(errorMessage));
        template.internalServerError.mockReturnValue({ status: 500, message: 'Internal Server Error' });

        const params = {
            name: 'usertest',
            email: 'test@test.com',
            password: 'password123',
            phone_number: '628123456789'
        };

        const result = await createUser(params);

        expect(result).toEqual({ status: 500, message: 'Internal Server Error' });
        expect(userRepository.findByEmail).toHaveBeenCalledWith({ email: params.email, transaction });
        expect(transaction.rollback).toHaveBeenCalled();
    });
});
