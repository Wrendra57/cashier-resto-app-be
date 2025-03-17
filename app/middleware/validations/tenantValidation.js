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
const listTenantsValidation = yup.object({
    query: yup.object({
        limit: yup
            .number()
            .typeError("Limit must be a number")
            .integer("Limit must be a number")
            .min(1, "Limit must be at least 1")
            .max(100, "Limit must be maximum 100"),
        page: yup
            .number()
            .typeError("Page must be a number")
            .integer("Page must be a number")
            .min(1, "Page must be at least 1"),
    })
});


module.exports = {createTenantValidation,listTenantsValidation}