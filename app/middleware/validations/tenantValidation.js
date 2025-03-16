const yup = require("yup")

const createTenantValidation = yup.object({
    body: yup.object({
        nameTenant: yup
            .string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters')
            .max(255, 'Name must be maximum 255 characters'),
        addressTenant: yup
            .string()
            .required('Address is required')
            .min(3, 'Address must be at least 3 characters')
            .max(255, 'Address must be maximum 255 characters')
    })
})

module.exports = {createTenantValidation}