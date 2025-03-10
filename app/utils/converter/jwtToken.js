const jwt = require('jsonwebtoken');
const createLogger = require('../logger');
const logger = createLogger(__filename);
const generateToken = (payload) =>{
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED });
        return token
    } catch (e) {
        logger.error({
            message: 'Error generating token',
            error: e.message,
        })
        throw new Error('Error generating token')
    }
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        logger.error({
            message: 'Error verifying token',
            error: e.message,
        });
       return null
    }
};

module.exports = {generateToken,verifyToken};