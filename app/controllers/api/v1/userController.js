const authService = require('../../../services/authService')
const userService = require('../../../services/userService')
const {toTemplateResponseApi} = require("../../../utils/template/templateResponeApi");

const findByUserId = async (req, res) => {
    const userId= req.params.id;
    const user = await authService.findById(userId);
    return res.status(user.code).json(toTemplateResponseApi(user));
}
const verifyUser = async (req, res) => {
    const userId= req.params.id;
    const user = await userService.verifyUser({isVerified:req.body.is_verified, userId:userId});
    return res.status(user.code).json(toTemplateResponseApi(user));
}

const changeRoles = async (req, res) => {
    const userId= req.params.id;
    const update = await userService.updateRoles({userId, newRole:req.body.role})
    return res.status(update.code).json(toTemplateResponseApi(update));
}
module.exports = { findByUserId,verifyUser,changeRoles};