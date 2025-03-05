const bcrypt = require("bcrypt");
require("dotenv").config();
const createLogger = require("../logger");
const logger = createLogger(__filename);

const encodedPassword = async (password) => {
    try {
        const encoded = await bcrypt.hash(password, parseInt(process.env.SALT));
        return encoded;
    } catch (error) {
        logger.error({
            message: 'Error hashing password',
            error: error.message,
        });
        return {
            status: 500,
            message: error.message,
            data: null,
        };
    }
};

const comparePasswords = async (password, encryptedPasswords) => {
    try {
        const compare = await bcrypt.compare(password, encryptedPasswords);
        return compare;
    } catch (error) {
        logger.error({
            message: 'Error comparing passwords',
            error: error.message,
        });
        return {
            status: 500,
            message: error.message,
            data: null,
        };
    }
};

module.exports = {
    encodedPassword,
    comparePasswords,
};
