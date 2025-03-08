const userService=require("../../../services/userService")
const createLogger = require("../../../utils/logger")
const logger = createLogger(__filename)
const template = require('../../../utils/template/templateResponeApi')
const {convertPhoneNumber} = require("../../../utils/converter/converterPhoneNumber");
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const phone_number = await convertPhoneNumber(req.body.phone_number);
        const registeredUser = await userService.createUser({ name, email, password, phone_number });

        return res.status(registeredUser.code).json(template.toTemplateResponseApi(registeredUser));
    } catch (error) {
        logger.error({
            message: 'Error registering user',
            error: error.message,
        });
        return res.status(500).json(template.internalServerError());
    }
};

const login = async (req, res) => {
    try {
        const { emailOrPhoneNumber, password } = req.body;
        const user = await userService.loginUser({ emailOrPhoneNumber, password });

        return res.status(user.code).json(template.toTemplateResponseApi(user));
    } catch (error) {
        logger.error({
            message: 'Error logging in user',
            error: error.message,
        });
        return res.status(500).json(template.internalServerError());
    }
};
module.exports= {registerUser,login}