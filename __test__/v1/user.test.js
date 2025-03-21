const app = require('../../app')
const request = require('supertest')
const {User,UserRole} = require('../../app/models')
const {sequelize} = require('../../app/models')
const jwt = require('jsonwebtoken');
const userService = require('../../app/services/userService');

jest.mock('../../app/services/userService');

describe("Test group endpoint api/v1/users", ()=>{
    beforeAll((done) =>{
        server = app.listen(done);
    })
    afterAll((done)=>{
        server.close(done);
    })
    const baseUrl = '/api/v1/users'

    describe('GET /api/v1/users/:id', () => {
        const validUserId = 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b';
        const notValidUserId = 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26c';
        const validToken = jwt.sign({ id: validUserId, role: ['user','admin','superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expiredToken = jwt.sign({ id: validUserId, role: ['user','admin','superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '-1h' });
        const notValidUserIdToken = jwt.sign({ id: notValidUserId, role: ['superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const invalidToken = 'invalid.token.here';

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return 200 and user data with a valid token', async () => {
            return request(server)
                .get(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(200);
                    expect(res.body.status).toEqual('Success');
                    expect(res.body.message).toEqual('User found');
                    expect(res.body.data).toHaveProperty('id', validUserId);
                });
        });

        it('should return 401 when token is missing', async () => {
            return request(server)
                .get(`${baseUrl}/${validUserId}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.status).toEqual('Unauthorized');
                    expect(res.body.message).toEqual('Authorization token is required');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 401 when token is invalid', async () => {
            return request(server)
                .get(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${invalidToken}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.status).toEqual('Unauthorized');
                    expect(res.body.message).toEqual('Invalid or expired token');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 401 when token is expired', async () => {
            return request(server)
                .get(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${expiredToken}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.status).toEqual('Unauthorized');
                    expect(res.body.message).toEqual('Invalid or expired token');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 400 when user not found', async () => {
            return request(server)
                .get(`${baseUrl}/${notValidUserId}`)
                .set('Authorization', `Bearer ${notValidUserIdToken}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.body.status).toEqual('Failed');
                    expect(res.body.message).toEqual('User not found');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 400 when user role not found', async () => {
            const userId = 'c0f2db86-88b9-43a7-bc65-0a0e2be8a26b';
            const Token = jwt.sign({ id: userId, role: ['superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return request(server)
                .get(`${baseUrl}/${userId}`)
                .set('Authorization', `Bearer ${Token}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.body.status).toEqual('Failed');
                    expect(res.body.message).toEqual('Role not found');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 500 when there is a database error', async () => {
            const mockDatabase = jest.spyOn(sequelize, 'query').mockImplementation((query, options) => {
                if (query.includes('users WHERE id = :id')) {
                    return Promise.reject(new Error('Database Error'));
                }
                return Promise.resolve([]);
            });

            return request(server)
                .get(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(500);
                    expect(res.body.status).toEqual('Error');
                    expect(res.body.message).toEqual('Internal Server Error');
                    expect(res.body.data).toEqual(null);
                }).finally(() => {
                    mockDatabase.mockRestore();
                });
        });
    });

    describe('PATCH /api/v1/users/verify/:id', () => {
        const baseUrl = '/api/v1/users/verify';
        const superAdminId = 'b155d3d3-6ee2-4139-aa2d-c22aa85903dc';
        const validUserId = '480b1d66-8c1b-4891-9415-c4218a62abad';
        const invalidUserId = 'invalid-uuid';
        const validToken = jwt.sign({ id: superAdminId, role: ['user','admin','superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expiredToken = jwt.sign({ id: superAdminId, role: ['user','admin','superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '-1h' });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return 200 and verify user successfully', async () => {
            userService.verifyUser.mockResolvedValue({
                code: 200,
                status: 'success',
                message: 'User verify updated successfully',
                data: { id: validUserId }
            });

            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ is_verified: 'true' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.message).toEqual('User verify updated successfully');
            expect(res.body.data).toHaveProperty('id', validUserId);
        });

        it('should return 400 for invalid user ID', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${invalidUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ is_verified: 'true' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toEqual('Failed');
            expect(res.body.message).toEqual('User ID must be a valid UUID');
            expect(res.body.data).toEqual(null);
        });

        it('should return 400 for missing is_verified field', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toEqual('Failed');
            expect(res.body.message).toEqual('is_verified is required');
            expect(res.body.data).toEqual(null);
        });

        it('should return 401 for missing token', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .send({ is_verified: 'true' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Authorization token is required');
            expect(res.body.data).toEqual(null);
        });

        it('should return 401 for expired token', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${expiredToken}`)
                .send({ is_verified: 'true' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Invalid or expired token');
            expect(res.body.data).toEqual(null);
        });

    });

    describe('PATCH /api/v1/users/roles/update/:id', () => {
        const baseUrl = '/api/v1/users/roles/update';
        const superAdminId = 'b155d3d3-6ee2-4139-aa2d-c22aa85903dc';
        const adminId = 'fb728f79-ce38-4857-9595-7abb152603cf';
        const validUserId = '4fc3a798-0818-41a0-80c9-3fb902021375';
        const invalidUserId = 'invalid-uuid';
        const validToken = jwt.sign({ id: superAdminId, role: ['superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expiredToken = jwt.sign({ id: superAdminId, role: ['superadmin'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '-1h' });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should update user roles successfully', async () => {
            userService.updateRoles.mockResolvedValue({
                code: 200,
                status: 'success',
                message: 'User roles updated successfully',
                data: { role: ['admin', 'user'] }
            });

            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ role: 'admin' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.message).toEqual('User roles updated successfully');
            expect(res.body.data).toHaveProperty('role', ['admin', 'user']);
        });

        it('should update user2 roles successfully', async () => {
            userService.updateRoles.mockResolvedValue({
                code: 200,
                status: 'success',
                message: 'User roles updated successfully',
                data: { role: ['user'] }
            });

            const res = await request(server)
                .patch(`${baseUrl}/${adminId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ role: 'user' });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual('success');
            expect(res.body.message).toEqual('User roles updated successfully');
            expect(res.body.data).toHaveProperty('role', ['user']);
        })

        it('should return 400 for invalid user ID', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${invalidUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({ role: 'admin' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toEqual('Failed');
            expect(res.body.message).toEqual('User ID must be a valid UUID');
            expect(res.body.data).toEqual(null);
        });

        it('should return 400 for missing role field', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body.status).toEqual('Failed');
            expect(res.body.message).toEqual('Roles is required');
            expect(res.body.data).toEqual(null);
        });

        it('should return 401 for missing token', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .send({ role: 'admin' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Authorization token is required');
            expect(res.body.data).toEqual(null);
        });

        it('should return 401 for expired token', async () => {
            const res = await request(server)
                .patch(`${baseUrl}/${validUserId}`)
                .set('Authorization', `Bearer ${expiredToken}`)
                .send({ role: 'admin' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.status).toEqual('Unauthorized');
            expect(res.body.message).toEqual('Invalid or expired token');
            expect(res.body.data).toEqual(null);
        });

    });
})