const userService = require('../../../services/authService')
const {toTemplateResponseApi} = require("../../../utils/template/templateResponeApi");

const findByUserId = async (req, res) => {
    const userId= req.params.id;
    const user = await userService.findById(userId);
    return res.status(user.code).json(toTemplateResponseApi(user));
}

module.exports = { findByUserId};