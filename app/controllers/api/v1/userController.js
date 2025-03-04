const userService=require("../../../services/userService")
const createLogger = require("../../../utils/logger")
const logger = createLogger(__filename)
const template = require('../../../utils/template/templateResponeApi')
const registerUser = async (req, res) => {
        const registeredUser = await userService.createUser({name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone_number: req.body.phone_number})

        return res.status(registeredUser.code).json(template.toTemplateResponseApi(registeredUser));
}

module.exports= {registerUser}