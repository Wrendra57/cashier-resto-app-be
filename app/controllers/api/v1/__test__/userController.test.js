const userController = require('../authController');
const userService = require('../../../../services/authService');
const template = require('../../../../utils/template/templateResponeApi');
const {toTemplateResponseApi} = require("../../../../utils/template/templateResponeApi");

jest.mock('../../../../services/authService');
jest.mock('../../../../utils/template/templateResponeApi');


describe('unit test userController function', ()=>{
    describe('unit test user controller function registerUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'usertest',
                email: 'test@test.com',
                password: 'password',
                phone_number: '628123456789'
            }
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return registered user data on success', async () => {
        const mockResponseService = {
            code: 201,
            status: 'success',
            message: 'User created successfully',
            data: {
                id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b'
            }
        };
        userService.createUser.mockResolvedValue(mockResponseService);
        toTemplateResponseApi.mockReturnValue({
            status: mockResponseService.status,
            message: mockResponseService.message,
            data: mockResponseService.data
        });

        await userController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: mockResponseService.status,
            message: mockResponseService.message,
            data: mockResponseService.data
        });
        expect(userService.createUser).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number
        });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockResponseService);
    });

    it('should return bad request if user already exists', async () => {
        const mockResponseService = {
            code: 400,
            status: 'fail',
            message: 'User already exists'
        };
        userService.createUser.mockResolvedValue(mockResponseService);
        toTemplateResponseApi.mockReturnValue({
            status: mockResponseService.status,
            message: mockResponseService.message
        });

        await userController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: mockResponseService.status,
            message: mockResponseService.message
        });
        expect(userService.createUser).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number
        });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockResponseService);
    });

    it('should handle internal server error', async () => {
        const mockResponseService = {
            code: 500,
            status: 'error',
            message: 'Internal Server Error'
        };
        userService.createUser.mockRejectedValue(new Error('Database query error'));
        template.internalServerError.mockReturnValue(mockResponseService);

        await userController.registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(mockResponseService);
        expect(userService.createUser).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number
        });
        expect(template.internalServerError).toHaveBeenCalled();
    });
});

    describe('unit test login function in userController', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    emailOrPhoneNumber: 'test@test.com',
                    password: 'password123'
                }
            };
            res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return token when login is successful', async () => {
            const mockResponseService = {
                code: 200,
                status: 'success',
                message: 'Login successfully',
                data: {
                    token: 'mockToken'
                }
            };
            userService.loginUser.mockResolvedValue(mockResponseService);
            template.toTemplateResponseApi.mockReturnValue({
                status: mockResponseService.status,
                message: mockResponseService.message,
                data: mockResponseService.data
            });

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: mockResponseService.status,
                message: mockResponseService.message,
                data: mockResponseService.data
            });
            expect(userService.loginUser).toHaveBeenCalledWith({
                emailOrPhoneNumber: req.body.emailOrPhoneNumber,
                password: req.body.password
            });
            expect(template.toTemplateResponseApi).toHaveBeenCalledWith(mockResponseService);
        });

        it('should return bad request if email or phone number is not found', async () => {
            const mockResponseService = {
                code: 400,
                status: 'fail',
                message: 'Email or phone number not found'
            };
            userService.loginUser.mockResolvedValue(mockResponseService);
            template.toTemplateResponseApi.mockReturnValue({
                status: mockResponseService.status,
                message: mockResponseService.message
            });

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: mockResponseService.status,
                message: mockResponseService.message
            });
            expect(userService.loginUser).toHaveBeenCalledWith({
                emailOrPhoneNumber: req.body.emailOrPhoneNumber,
                password: req.body.password
            });
            expect(template.toTemplateResponseApi).toHaveBeenCalledWith(mockResponseService);
        });

        it('should return bad request if password is incorrect', async () => {
            const mockResponseService = {
                code: 400,
                status: 'fail',
                message: 'Password is incorrect'
            };
            userService.loginUser.mockResolvedValue(mockResponseService);
            template.toTemplateResponseApi.mockReturnValue({
                status: mockResponseService.status,
                message: mockResponseService.message
            });

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: mockResponseService.status,
                message: mockResponseService.message
            });
            expect(userService.loginUser).toHaveBeenCalledWith({
                emailOrPhoneNumber: req.body.emailOrPhoneNumber,
                password: req.body.password
            });
            expect(template.toTemplateResponseApi).toHaveBeenCalledWith(mockResponseService);
        });

        it('should return bad request if role is not found', async () => {
            const mockResponseService = {
                code: 400,
                status: 'fail',
                message: 'Role not found'
            };
            userService.loginUser.mockResolvedValue(mockResponseService);
            template.toTemplateResponseApi.mockReturnValue({
                status: mockResponseService.status,
                message: mockResponseService.message
            });

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: mockResponseService.status,
                message: mockResponseService.message
            });
            expect(userService.loginUser).toHaveBeenCalledWith({
                emailOrPhoneNumber: req.body.emailOrPhoneNumber,
                password: req.body.password
            });
            expect(template.toTemplateResponseApi).toHaveBeenCalledWith(mockResponseService);
        });

        it('should handle error during login process', async () => {
            const errorMessage = 'Database query error';
            userService.loginUser.mockRejectedValue(new Error(errorMessage));
            template.internalServerError.mockReturnValue({
                code: 500,
                status: 'error',
                message: 'Internal Server Error'
            });


            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                code: 500,
                status: 'error',
                message: 'Internal Server Error'
            });
            expect(userService.loginUser).toHaveBeenCalledWith({
                emailOrPhoneNumber: req.body.emailOrPhoneNumber,
                password: req.body.password
            });
        });
    });
})