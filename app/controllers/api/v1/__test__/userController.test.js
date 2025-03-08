const userController = require('../userController');
const userService = require('../../../../services/userService');
const template = require('../../../../utils/template/templateResponeApi');
const {toTemplateResponseApi} = require("../../../../utils/template/templateResponeApi");

jest.mock('../../../../services/userService');
jest.mock('../../../../utils/template/templateResponeApi');

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