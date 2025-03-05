const userService=require("../../../services/userService")
const createLogger = require("../../../utils/logger")
const logger = createLogger(__filename)
const template = require('../../../utils/template/templateResponeApi')
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone_number } = req.body;

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
module.exports= {registerUser}