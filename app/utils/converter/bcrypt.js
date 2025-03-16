const bcrypt = require("bcrypt");
require("dotenv").config();
const createLogger = require("../../utils/logger")
const logger = createLogger(__filename)

const encodedPassword = async (password) => {
    try {
        return await bcrypt.hash(password, parseInt(process.env.SALT));
    } catch (err) {
        logger.error({
            message: 'Database query error',
            error: err.message,
        });
        throw new Error("Error hashing password: " + err.message);
    }
};

const comparePasswords = async (password, encryptedPasswords) => {
    try {
        return await bcrypt.compare(password, encryptedPasswords);
    } catch (err) {
        logger.error({
            message: 'Error comparing passwords',
            error: err.message,
        });
        throw new Error("Error comparing passwords: " + err.message);
    }
};

module.exports = {
    encodedPassword,
    comparePasswords,
};
