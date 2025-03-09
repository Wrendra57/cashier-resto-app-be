const userRepository = require('../../repositories/userRepository')
const userRoleRepository = require('../../repositories/userRoleRepository')
const {createUser, loginUser} = require('../authService')
const sequelize = require('../../models').sequelize
const Bcrypt = require('../../utils/converter/bcrypt');
const template = require('../../utils/template/templateResponeApi');
const jwtToken = require('../../utils/converter/jwtToken');
const createLogger = require('../../utils/logger');
const logger = createLogger(__filename);


jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/userRoleRepository');
jest.mock('../../models');
jest.mock('../../utils/converter/bcrypt');
jest.mock('../../utils/converter/jwtToken');
jest.mock('../../utils/template/templateResponeApi');

describe('unit test function in userService', ()=>{
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
    describe('unit test loginUser function in userService', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        const mockUser = {
            id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
            email: 'test@test.com',
            password: '$2b$12$5DboT0TmoojFyGD5MtFoMeZ5VfgAYZoglvGtGKK6UqTlQJjxH03qO',
            phone_number: '628123456789',
            is_verified: false,
        };

        const mockRole = {
            user_id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
            roles: ['user']
        };

        it('should return token when login is successful', async () => {
            userRepository.findByEmailOrPhoneNumber.mockResolvedValue(mockUser);
            Bcrypt.comparePasswords.mockResolvedValue(true);
            userRoleRepository.findByUserId.mockResolvedValue(mockRole);
            jwtToken.generateToken.mockReturnValue('mockToken');
            template.success.mockReturnValue({ status: 200, message: 'Login successfully', data: { token: 'mockToken' } });

            const params = { emailOrPhoneNumber: 'test@test.com', password: 'password123' };
            const result = await loginUser(params);

            expect(result).toEqual({ status: 200, message: 'Login successfully', data: { token: 'mockToken' } });
            expect(userRepository.findByEmailOrPhoneNumber).toHaveBeenCalledWith({ params: params.emailOrPhoneNumber });
            expect(Bcrypt.comparePasswords).toHaveBeenCalledWith(params.password, mockUser.password);
            expect(userRoleRepository.findByUserId).toHaveBeenCalledWith({ userId: mockUser.id });
            expect(jwtToken.generateToken).toHaveBeenCalledWith({ id: mockUser.id, role: mockRole.roles, is_verified: mockUser.is_verified });
        });

        it('should return bad request if email or phone number is not found', async () => {
            userRepository.findByEmailOrPhoneNumber.mockResolvedValue(null);
            template.badRequest.mockReturnValue({ status: 400, message: 'Email or phone number not found' });

            const params = { emailOrPhoneNumber: 'notfound@test.com', password: 'password123' };
            const result = await loginUser(params);

            expect(result).toEqual({ status: 400, message: 'Email or phone number not found' });
            expect(userRepository.findByEmailOrPhoneNumber).toHaveBeenCalledWith({ params: params.emailOrPhoneNumber });
        });

        it('should return bad request if password is incorrect', async () => {
            userRepository.findByEmailOrPhoneNumber.mockResolvedValue(mockUser);
            Bcrypt.comparePasswords.mockResolvedValue(false);
            template.badRequest.mockReturnValue({ status: 400, message: 'Password is incorrect' });

            const params = { emailOrPhoneNumber: 'test@test.com', password: 'wrongpassword' };
            const result = await loginUser(params);

            expect(result).toEqual({ status: 400, message: 'Password is incorrect' });
            expect(userRepository.findByEmailOrPhoneNumber).toHaveBeenCalledWith({ params: params.emailOrPhoneNumber });
            expect(Bcrypt.comparePasswords).toHaveBeenCalledWith(params.password, mockUser.password);
        });

        it('should return bad request if role is not found', async () => {
            userRepository.findByEmailOrPhoneNumber.mockResolvedValue(mockUser);
            Bcrypt.comparePasswords.mockResolvedValue(true);
            userRoleRepository.findByUserId.mockResolvedValue(null);
            template.badRequest.mockReturnValue({ status: 400, message: 'Role not found' });

            const params = { emailOrPhoneNumber: 'test@test.com', password: 'password123' };
            const result = await loginUser(params);

            expect(result).toEqual({ status: 400, message: 'Role not found' });
            expect(userRepository.findByEmailOrPhoneNumber).toHaveBeenCalledWith({ params: params.emailOrPhoneNumber });
            expect(Bcrypt.comparePasswords).toHaveBeenCalledWith(params.password, mockUser.password);
            expect(userRoleRepository.findByUserId).toHaveBeenCalledWith({ userId: mockUser.id });
        });

        it('should handle error during user login', async () => {
            const errorMessage = 'Database query error';
            userRepository.findByEmailOrPhoneNumber.mockRejectedValue(new Error(errorMessage));
            template.internalServerError.mockReturnValue({ status: 500, message: 'Internal Server Error' });

            const params = { emailOrPhoneNumber: 'test@test.com', password: 'password123' };
            const result = await loginUser(params);

            expect(result).toEqual({ status: 500, message: 'Internal Server Error' });
            expect(userRepository.findByEmailOrPhoneNumber).toHaveBeenCalledWith({ params: params.emailOrPhoneNumber });
        });
    });
})

