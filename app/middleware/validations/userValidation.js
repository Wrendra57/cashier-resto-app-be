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
            .required("Phone number is required")
            .transform((value) => {
                if (value == null) return "";
                const phoneNumber = convertPhoneNumber(value);
                return phoneNumber !== false ? phoneNumber : value;
            })
            .min(7, "Phone number must be at least 7 characters")
            .max(15, "Phone number must be maximum 15 characters")
            .matches(/^[0-9]+$/, { message: "Phone number must be only number" })
            .test("is-valid-phone", "Phone number is not valid", (value) => {
                if (!value) return false;
                return convertPhoneNumber(value) !== false;
            }),


    })
})

const loginUserValidation = yup.object({
    body: yup.object({
        emailOrPhoneNumber: yup
            .string()
            .transform((value) => {
                if (value == null) return ""; // Ubah null/undefined jadi string kosong
                if (typeof value === "number") return String(value); // Konversi number ke string
                value = value.trim(); // Hapus spasi di awal/akhir

                // Coba konversi ke nomor telepon, jika valid
                const convertedPhone = convertPhoneNumber(value);
                return convertedPhone !== false ? convertedPhone : value;
            })
            .required("Email or phone number is required")
            .test("email-or-phone", "Must be a valid email or phone number", (value) => {
                if (!value) return false;
                console.log(value)
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^[0-9]{10,15}$/; // Setelah dikonversi, hanya angka yang valid

                return emailRegex.test(value) || phoneRegex.test(value);
            }),
        password: yup
            .string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
    })
})

const findByUserIdValidation = yup.object({
    params: yup.object({
        id: yup
            .string()
            .required("User ID is required")
            .uuid("User ID must be a valid UUID")
    })
})

const verifyUserValidation = yup.object({
    params: yup.object({
        id: yup
            .string()
            .required("User ID is required")
            .uuid("User ID must be a valid UUID")
    }),
    body: yup.object({
        is_verified: yup
            .string()
            .required("is_verified is required")
            .matches(/^(true|false)$/, "is_verified must be a boolean value")
    })
})

const changeRolesValidation = yup.object({
    params: yup.object({
        id: yup
            .string()
            .required("User ID is required")
            .uuid("User ID must be a valid UUID")
    }),
    body: yup.object({
        role: yup
            .string()
            .required("Roles is required")
            .oneOf(["user", "admin", "superadmin"], "Roles must be one of user, admin, superadmin")
    })
})


module.exports = {createUserValidation,loginUserValidation,findByUserIdValidation,verifyUserValidation,changeRolesValidation}