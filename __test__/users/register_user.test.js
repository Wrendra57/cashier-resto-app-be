const app = require('../../app')
const request = require('supertest')
const {User,UserRole} = require('../../app/models')
const {sequelize} = require('../../app/models')

describe('Test group endpoint api/v1/users', () => {
    beforeAll((done) =>{
        server = app.listen(done);
    })
    afterAll((done)=>{
        server.close(done);
    })
    const baseUrl = '/api/v1/users'
    describe('POST /users/register', () => {
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();

        })

        it('should return 201 when user is created', async () => {
            const body = {
                email: 'test_register_user_register_1@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '08345678901'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(201)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('User created successfully')
                    expect(res.body.data).toHaveProperty('id')
                    expect(res.body.data.id).not.toEqual(null)
                })
        })
        it('should return 500 Error Internal Server Error when user is not created', async () => {
            const mockDatabase = jest.spyOn(User, 'create').mockRejectedValue(new Error('Database Error When Creating User'))

            const body = {
                email: 'test_register_user_register_2@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '08345678902'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(500)
                    expect(res.body.status).toEqual('Error')
                    expect(res.body.message).toEqual('Internal Server Error')
                    expect(res.body.data).toEqual(null)
                }).finally(()=>{
                    mockDatabase.mockRestore()
                })
        })
        it('Should fail when name is missing (required field)', async () => {
            const body = {
                email: 'test_register_user_register_3@test.com',
                password: 'test123',
                phone_number: '08345678903'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Name is required')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when name is less than 3 characters', async () => {
            const body = {
                email: 'test_register_user_register_4@test.com',
                password: 'test123',
                name:'te',
                phone_number: '08345678904'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Name must be at least 3 characters')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when name exceeds 255 characters', async () => {
            const body = {
                email: 'test_register_user_register_5@test.com',
                password: 'test123',
                name:'t'.repeat(256),
                phone_number: '08345678905'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Name must be maximum 255 characters')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when name contains non-alphabet characters', async () => {
            const body = {
                email: 'test_register_user_register_6@test.com',
                password: 'test123',
                name:'dwads3',
                phone_number: '08345678906'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Name must be only alphabet')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when email is missing (required field)', async () => {
            const body = {
                password: 'test123',
                name:'test',
                phone_number: '08345678907'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email is required')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when email is not valid', async () => {
            const body = {
                email: 'test_register_user_register_8',
                password: 'test123',
                name:'test',
                phone_number: '08345678908'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email is not valid')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when password is missing (required field)', async () => {
            const body = {
                email: 'test_register_user_register_9@test.com',
                name:'test',
                phone_number: '08345678909'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password is required')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when password is less than 6 characters', async () => {
            const body = {
                email: 'test_register_user_register_10@test.com',
                password: 'test1',
                name:'test',
                phone_number: '083456789010'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password must be at least 6 characters')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when phone number is missing (required field)', async () => {
            const body = {
                email: 'test_register_user_register_11@test.com',
                password: 'test1',
                name:'test',
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Phone number is required')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when phone number is less than 7 characters', async () => {
            const body = {
                email: 'test_register_user_register_12@test.com',
                password: 'test1',
                name:'test',
                phone_number: '0834567'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password must be at least 6 characters')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when phone number exceeds 15 characters', async () => {
            const body = {
                email: 'test_register_user_register_13@test.com',
                password: 'test1',
                name:'test',
                phone_number: '0834567890123456'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Phone number must be maximum 15 characters')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when phone number contains non-numeric characters', async () => {
            const body = {
                email: 'test_register_user_register_14@test.com',
                password: 'test1',
                name:'test',
                phone_number: '083456734@3'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Phone number must be only number')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('Should fail when phone number format is invalid (convertPhoneNumber returns null)', async () => {
            const body = {
                email: 'test_register_user_register_15@test.com',
                password: 'test1',
                name:'test',
                phone_number: '183456734334'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Phone number is not valid')
                    expect(res.body.data).toEqual(null)
                })
        })

        it('should return 400 when email is used', async () => {
            const body = {
                email: 'testing_1@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '0834567890123'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email or phone number already exists')
                    expect(res.body.data).toEqual(null)
                })
        })
        it('should return 400 when phone_number is used', async () => {
            const body = {
                email: 'testing_register_1@test.com',
                password: '628324524002',
                name: 'test',
                phone_number: '628324524002'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email or phone number already exists')
                    expect(res.body.data).toEqual(null)
                })
        })

        it('should return 500 Error Internal Server Error when DB query error on user repository findByEmail() ', async () => {
            // const mockDatabase = jest.spyOn(User, 'create').mockRejectedValue(new Error('Database Error When Creating User'))

            const mockDatabase= jest.spyOn(sequelize, "query").mockImplementation((query, options) => {
                if (query.includes("WHERE email = :email")) {
                    return Promise.reject(mockError); // Simulasi error untuk findByEmail
                }
                return Promise.resolve([]); // Query lain tetap berjalan normal
            });
            const body = {
                email: 'test_register_user_register_16@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '08345678916'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(500)
                    expect(res.body.status).toEqual('Error')
                    expect(res.body.message).toEqual('Internal Server Error')
                    expect(res.body.data).toEqual(null)
                }).finally(()=>{
                    mockDatabase.mockRestore()
                })
        })
        it('should return 500 Error Internal Server Error when DB query error on user repository findByPhoneNumber() ', async () => {

            const mockDatabase= jest.spyOn(sequelize, "query").mockImplementation((query, options) => {
                if (query.includes("WHERE phone_number = :phoneNumber")) {
                    return Promise.reject(mockError); // Simulasi error untuk findByEmail
                }
                return Promise.resolve([]); // Query lain tetap berjalan normal
            });
            const body = {
                email: 'test_register_user_register_17@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '08345678917'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(500)
                    expect(res.body.status).toEqual('Error')
                    expect(res.body.message).toEqual('Internal Server Error')
                    expect(res.body.data).toEqual(null)
                }).finally(()=>{
                    mockDatabase.mockRestore()
                })
        })
        it('should return 500 Error Internal Server Error when user_role is not created', async () => {
            const mockDatabase = jest.spyOn(UserRole, 'create').mockRejectedValue(new Error('Database Error When Creating User'))

            const body = {
                email: 'test_register_user_register_18@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '08345678918'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(500)
                    expect(res.body.status).toEqual('Error')
                    expect(res.body.message).toEqual('Internal Server Error')
                    expect(res.body.data).toEqual(null)
                }).finally(()=>{
                    mockDatabase.mockRestore()
                })
        })
        it('should return 500 Error Internal Server Error when controller catch error', async () => {
            const mockDatabase = jest.spyOn(UserRole, 'create').mockRejectedValue(new Error('Database Error When Creating User'))

            const body = {
                email: 'test_register_user_register_18@test.com',
                password: 'test123',
                name: 'test',
                phone_number: '08345678918'
            }
            return request(server)
                .post(`${baseUrl}`)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(500)
                    expect(res.body.status).toEqual('Error')
                    expect(res.body.message).toEqual('Internal Server Error')
                    expect(res.body.data).toEqual(null)
                }).finally(()=>{
                    mockDatabase.mockRestore()
                })
        })

    })

})