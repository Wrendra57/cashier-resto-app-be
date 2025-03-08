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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (e) {
        logger.error({
            message: 'Error verifying token',
            error: e.message,
        });
        throw new Error('Error verifying token');
    }
};

module.exports = {generateToken,verifyToken};