const yup = require("yup")
const regex = /^[a-zA-Z\s]+$/;
const {convertPhoneNumber} = require("../../utils/converter/converterPhoneNumber")
const createUserValidation = yup.object({
    body: yup.object({
        name: yup
            .string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters')
            .max(255, 'Name must be maximum 255 characters')
            .matches(regex,{message:"Name must be only alphabet"}),
        email: yup
            .string()
            .required('Email is required')
            .email("Email is not valid"),
        password: yup
            .string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        phone_number: yup
            .string()
            .required('Phone number is required')
            .min(7, 'Phone number must be at least 7 characters')
            .max(15, 'Phone number must be maximum 15 characters')
            .matches(/^[0-9]+$/, {message: "Phone number must be only number"})
            .test('is-valid-phone', 'Phone number is not valid', value => {
                if (!value) return false;
                const phoneNumber = convertPhoneNumber(value);
                return phoneNumber !== null;
            })
            .transform(value => {
                const phoneNumber = convertPhoneNumber(value);
                return phoneNumber !== null ? phoneNumber : value;
            }),
    })
})

module.exports = {createUserValidation}