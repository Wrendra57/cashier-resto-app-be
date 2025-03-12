const userController = require('../userController');
const authService = require('../../../../services/authService');
const userService = require('../../../../services/userService');
const { toTemplateResponseApi } = require('../../../../utils/template/templateResponeApi');

jest.mock('../../../../services/authService');
jest.mock('../../../../services/userService');
jest.mock('../../../../utils/template/templateResponeApi');

describe('unit test user controller', ()=> {


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
            const mockResponse = {code: 400, message: 'User not found'};
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
            const mockResponse = {code: 400, message: 'Role not found'};
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

    describe('verifyUser function', () => {
        let req, res;

        beforeEach(() => {
            req = {
                params: {
                    id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b'
                },
                body: {
                    is_verified: true
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

        it('should update user verification status successfully', async () => {
            const mockResponse = { code: 200, status:"success", message: 'User verify updated successfully', data: { id: req.params.id } };
            userService.verifyUser.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'success',
                message: 'User verify updated successfully',
                data: { id: req.params.id }
            });

            await userController.verifyUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'User verify updated successfully',
                data: { id: req.params.id }
            });
            expect(userService.verifyUser).toHaveBeenCalledWith({ isVerified: req.body.is_verified, userId: req.params.id });
        });

        it('should return bad request if user is not found', async () => {
            const mockResponse = { code: 400, status:"fail", message: 'User not found' };
            userService.verifyUser.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'fail',
                message: 'User not found'
            });

            await userController.verifyUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'User not found'
            });
            expect(userService.verifyUser).toHaveBeenCalledWith({ isVerified: req.body.is_verified, userId: req.params.id });
        });

        it('should handle error during user verification update', async () => {
            const mockResponse = { code: 500, status:"error", message: 'Internal Server Error' };
            userService.verifyUser.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'error',
                message: 'Internal Server Error'
            });

            await userController.verifyUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Internal Server Error'
            });
            expect(userService.verifyUser).toHaveBeenCalledWith({ isVerified: req.body.is_verified, userId: req.params.id });
        });
    });

    describe('unit test changeRoles function in userController', () => {
        let req, res;

        beforeEach(() => {
            req = {
                params: {
                    id: 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b'
                },
                body: {
                    role: 'admin'
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

        it('should update user roles successfully', async () => {
            const mockResponse = { code: 200, status: 'success', message: 'User roles updated successfully', data: { role: ['admin', 'user'] } };
            userService.updateRoles.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'success',
                message: 'User roles updated successfully',
                data: { role: ['admin', 'user'] }
            });

            await userController.changeRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 'success',
                message: 'User roles updated successfully',
                data: { role: ['admin', 'user'] }
            });
            expect(userService.updateRoles).toHaveBeenCalledWith({ userId: req.params.id, newRole: req.body.role });
        });

        it('should return bad request if user is not found', async () => {
            const mockResponse = { code: 400, status: 'fail', message: 'User not found' };
            userService.updateRoles.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'fail',
                message: 'User not found'
            });

            await userController.changeRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'User not found'
            });
            expect(userService.updateRoles).toHaveBeenCalledWith({ userId: req.params.id, newRole: req.body.role });
        });

        it('should return bad request if role is not found', async () => {
            const mockResponse = { code: 400, status: 'fail', message: 'Role not found' };
            userService.updateRoles.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'fail',
                message: 'Role not found'
            });

            await userController.changeRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'Role not found'
            });
            expect(userService.updateRoles).toHaveBeenCalledWith({ userId: req.params.id, newRole: req.body.role });
        });

        it('should return bad request if no changes in roles', async () => {
            const mockResponse = { code: 400, status: 'fail', message: 'No changes in roles' };
            userService.updateRoles.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'fail',
                message: 'No changes in roles'
            });

            await userController.changeRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: 'fail',
                message: 'No changes in roles'
            });
            expect(userService.updateRoles).toHaveBeenCalledWith({ userId: req.params.id, newRole: req.body.role });
        });

        it('should handle error during role update', async () => {
            const mockResponse = { code: 500, status: 'error', message: 'Internal Server Error' };
            userService.updateRoles.mockResolvedValue(mockResponse);
            toTemplateResponseApi.mockReturnValue({
                status: 'error',
                message: 'Internal Server Error'
            });

            await userController.changeRoles(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 'error',
                message: 'Internal Server Error'
            });
            expect(userService.updateRoles).toHaveBeenCalledWith({ userId: req.params.id, newRole: req.body.role });
        });
    });
})