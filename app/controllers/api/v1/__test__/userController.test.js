const userController = require('../userController');
const authService = require('../../../../services/authService');
const { toTemplateResponseApi } = require('../../../../utils/template/templateResponeApi');

jest.mock('../../../../services/authService');
jest.mock('../../../../utils/template/templateResponeApi');

describe('findByUserId function', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b'
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

    it('should return user when user and role are found', async () => {
        const mockUser = {
            code: 200,
            message: 'User found',
            data: {
                id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b',
                name: 'usertest',
                email: 'test@test.com',
                phone_number: '628123456789',
                is_verified: true,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                role: ['user']
            }
        };
        authService.findById.mockResolvedValue(mockUser);
        toTemplateResponseApi.mockReturnValue({
            status: 'success',
            message: 'User found',
            data: mockUser.data
        });

        await userController.findByUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'User found',
            data: mockUser.data
        });
        expect(authService.findById).toHaveBeenCalledWith(req.params.id);
    });

    it('should return bad request if user is not found', async () => {
        const mockResponse = { code: 400, message: 'User not found' };
        authService.findById.mockResolvedValue(mockResponse);
        toTemplateResponseApi.mockReturnValue({
            status: 'fail',
            message: 'User not found'
        });

        await userController.findByUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'User not found'
        });
        expect(authService.findById).toHaveBeenCalledWith(req.params.id);
    });

    it('should return bad request if role is not found', async () => {
        const mockResponse = { code: 400, message: 'Role not found' };
        authService.findById.mockResolvedValue(mockResponse);
        toTemplateResponseApi.mockReturnValue({
            status: 'fail',
            message: 'Role not found'
        });

        await userController.findByUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            message: 'Role not found'
        });
        expect(authService.findById).toHaveBeenCalledWith(req.params.id);
    });

});