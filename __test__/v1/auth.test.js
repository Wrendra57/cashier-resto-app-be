const app = require('../../app')
const request = require('supertest')
const {User,UserRole} = require('../../app/models')
const {sequelize} = require('../../app/models')
const jwt = require('jsonwebtoken');

describe('Test group endpoint api/v1/auth', () => {
    beforeAll((done) =>{
        server = app.listen(done);
    })
    afterAll((done)=>{
        server.close(done);
    })
    const baseUrl = '/api/v1/auth'
    describe('POST api/v1/auth/register', () => {
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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
                .post(`${baseUrl}/register`)
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

    describe('POST api/v1/auth/login', ()=>{
        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        })
        const endpoint = `${baseUrl}/login`
        // Test cases for emailOrPhoneNumber
        it('should return 200 when user is login with email', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_1@test.com',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(200)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('Login successfully')
                    expect(res.body.data).toHaveProperty('token')
                    expect(res.body.data.token).not.toEqual(null)
                })
        })

        it('should return 200 when user is login with phone_number', async () => {
            const body = {
                emailOrPhoneNumber: "08324524003",
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    console.log(res.body)
                    expect(res.statusCode).toEqual(200)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('Login successfully')
                    expect(res.body.data).toHaveProperty('token')
                    expect(res.body.data.token).not.toEqual(null)
                })
        })

        it('should return 400 when email is missing @ symbol', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_1test.com',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when email is missing domain', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_1@',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when email has invalid special characters', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_1@test_com',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 200 when user logs in with a valid phone number (local format)', async () => {
            const body = {
                emailOrPhoneNumber: '08324524003',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(200)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('Login successfully')
                    expect(res.body.data).toHaveProperty('token')
                    expect(res.body.data.token).not.toEqual(null)
                })
        });

        it('should return 200 when user logs in with a valid phone number (international format)', async () => {
            const body = {
                emailOrPhoneNumber: '+628324524003',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(200)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('Login successfully')
                    expect(res.body.data).toHaveProperty('token')
                    expect(res.body.data.token).not.toEqual(null)
                })
        });

        it('should return 400 when phone number contains letters', async () => {
            const body = {
                emailOrPhoneNumber: '+6283abc524003',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when phone number contains special characters other than +', async () => {
            const body = {
                emailOrPhoneNumber: '#628324524003',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when phone number is too short', async () => {
            const body = {
                emailOrPhoneNumber: '08324544',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when phone number is too long', async () => {
            const body = {
                emailOrPhoneNumber: '0832454445345534',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Must be a valid email or phone number')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 200 when phone number 08123456789 is converted to 628123456789', async () => {
            const body = {
                emailOrPhoneNumber: '628324524003',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(200)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('Login successfully')
                    expect(res.body.data).toHaveProperty('token')
                    expect(res.body.data.token).not.toEqual(null)
                })
        });

        it('should return 400 when emailOrPhoneNumber is empty', async () => {
            const body = {
                emailOrPhoneNumber: '',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email or phone number is required')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when emailOrPhoneNumber is null', async () => {
            const body = {
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email or phone number is required')
                    expect(res.body.data).toEqual(null)
                })
        });

        // Test cases for password
        it('should return 200 when user logs in with a valid password', async () => {
            const body = {
                emailOrPhoneNumber: '628324524003',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(200)
                    expect(res.body.status).toEqual('Success')
                    expect(res.body.message).toEqual('Login successfully')
                    expect(res.body.data).toHaveProperty('token')
                    expect(res.body.data.token).not.toEqual(null)
                })
        });

        it('should return 400 when password is less than 6 characters', async () => {
            const body = {
                emailOrPhoneNumber: '628324524003',
                password: 'passw',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password must be at least 6 characters')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when password is empty', async () => {
            const body = {
                emailOrPhoneNumber: '628324524003',
                password: '',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password is required')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when password is null', async () => {
            const body = {
                emailOrPhoneNumber: '628324524003',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password is required')
                    expect(res.body.data).toEqual(null)
                })
        });

        // Test cases for user service
        it('should return 400 when user not existing', async () => {
            const body = {
                emailOrPhoneNumber: 'abcd@defg.com',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Email or phone number not found')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when password in correct', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_1@test.com',
                password: 'passw0rd',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Password is incorrect')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when user not verified', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_3@test.com',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Account not verified')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 400 when role not found', async () => {
            const body = {
                emailOrPhoneNumber: 'testing_login_2@test.com',
                password: 'password',
            }
            return request(server)
                .post(endpoint)
                .send(body)
                .then((res)=>{
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.status).toEqual('Failed')
                    expect(res.body.message).toEqual('Role not found')
                    expect(res.body.data).toEqual(null)
                })
        });

        it('should return 500 when database error user repository findByEmailOrPhoneNumber ', async () => {
            const mockDatabase= jest.spyOn(sequelize, "query").mockImplementation((query, options) => {
                if (query.includes("SELECT * FROM users WHERE email = :params or phone_number = :params")) {
                    return Promise.reject(mockError);
                }
                return Promise.resolve([]);
            });
            const body = {
                emailOrPhoneNumber: 'testing_login_1@test.com',
                password: 'password',
            }
            return request(server)
                .post(`${baseUrl}/login`)
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

    describe('GET /api/v1/auth/me', () => {
        const validUserId = 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26b';
        const notValidUserId = 'b0f2db86-88b9-43a7-bc65-0a0e2be8a26c';
        const validToken = jwt.sign({ id: validUserId, role: ['user'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expiredToken = jwt.sign({ id: validUserId, role: ['user'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '-1h' });
        const notValidUserIdToken = jwt.sign({ id: notValidUserId, role: ['user'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const invalidToken = 'invalid.token.here';

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should return 200 and user data with a valid token', async () => {
            return request(server)
                .get(`${baseUrl}/me`)
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
                .get(`${baseUrl}/me`)
                .then((res) => {
                    expect(res.statusCode).toEqual(401);
                    expect(res.body.status).toEqual('Unauthorized');
                    expect(res.body.message).toEqual('Authorization token is required');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 401 when token is invalid', async () => {
            return request(server)
                .get(`${baseUrl}/me`)
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
                .get(`${baseUrl}/me`)
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
                .get(`${baseUrl}/me`)
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
            const Token = jwt.sign({ id: userId, role: ['user'], is_verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return request(server)
                .get(`${baseUrl}/me`)
                .set('Authorization', `Bearer ${Token}`)
                .then((res) => {
                    expect(res.statusCode).toEqual(400);
                    expect(res.body.status).toEqual('Failed');
                    expect(res.body.message).toEqual('Role not found');
                    expect(res.body.data).toEqual(null);
                });
        });

        it('should return 500 when there is a database error', async () => {
            // const mockDatabase = jest.spyOn(User, 'query').mockRejectedValue(new Error('Database Error'));

            const mockDatabase= jest.spyOn(sequelize, "query").mockImplementation((query, options) => {
                if (query.includes("users WHERE id = :id")) {
                    return Promise.reject(mockError);
                }
                return Promise.resolve([]);
            });

            return request(server)
                .get(`${baseUrl}/me`)
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
})