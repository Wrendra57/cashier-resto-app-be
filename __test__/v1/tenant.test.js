const app = require('../../app')
const request = require('supertest')
const {User,UserRole} = require('../../app/models')
const {sequelize} = require('../../app/models')
const jwt = require('jsonwebtoken');
const userService = require('../../app/services/userService');

jest.mock('../../app/services/userService');

describe('', () => {
    
})
