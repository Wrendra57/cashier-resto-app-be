const {toTemplateResponseApi} = require("../../utils/template/templateResponeApi");
const validation = (schema) => async (req,res,next) =>{
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
            noUnknown:true,
            strict:true,
        })
        return next();
    } catch (err) {
        const send = {
            status: "Failed",
            message: err.message,
            data: null,
        }

        return res.status(400).json(toTemplateResponseApi(send))
    }
}

module.exports = {
    validation
}