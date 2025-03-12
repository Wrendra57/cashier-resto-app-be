const userService=require("../../../services/authService")
const createLogger = require("../../../utils/logger")
const logger = createLogger(__filename)
const template = require('../../../utils/template/templateResponeApi')
const {convertPhoneNumber} = require("../../../utils/converter/converterPhoneNumber");
const {toTemplateResponseApi} = require("../../../utils/template/templateResponeApi");
const registerUser = async (req, res) => {
        const { name, email, password } = req.body;
        const phone_number = await convertPhoneNumber(req.body.phone_number);
        const registeredUser = await userService.createUser({ name, email, password, phone_number });

        return res.status(registeredUser.code).json(template.toTemplateResponseApi(registeredUser));
};

const login = async (req, res) => {

        let { emailOrPhoneNumber, password } = req.body;
        emailOrPhoneNumber = String(emailOrPhoneNumber).trim()

        const phoneRegex = /^\+?[0-9]+$/

      if (phoneRegex.test(emailOrPhoneNumber)) {
          emailOrPhoneNumber= await convertPhoneNumber(emailOrPhoneNumber);
          if (!emailOrPhoneNumber) {
              return res.status(400).json(template.badRequest('Phone number is not valid'));
          }
      }

        const user = await userService.loginUser({ emailOrPhoneNumber, password });

        return res.status(user.code).json(template.toTemplateResponseApi(user));

};

const authMe = async (req, res) => {
        const userId= req.user.id;
        const user = await userService.findById(userId);
        return res.status(user.code).json(toTemplateResponseApi(user));
}
module.exports= {registerUser,login,authMe}