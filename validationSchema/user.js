const Joi = require('joi');

const { ADMIN, USER } = require('../etc/roles')


const userSchema = Joi.object({
    firstName: Joi.string()
        .regex(/^[a-zA-Z ]*$/)
        .required()
        .min(3)
        .max(20)
    ,


    lastName: Joi.string()
        .regex(/^[a-zA-Z ]*$/)
        .required()
        .min(3)
        .max(20)
    ,


    phoneNumber: Joi.string()
        .regex(/^\d*$/)
        .required()
        .min(10)
        .max(13),

    email: Joi.string()
        .email()
        .required()
    ,

    role: Joi.string()
        .valid(USER, ADMIN)
        .required()
        .messages({
            'any.only':"Role must be either user or admin."
        })
    ,


    password: Joi.string()
        .min(6)
        .max(16)
    ,

});







// const user = {
//     firstName: "p",
//     lastName: "rajbhar",
//     email: "pankgmail.com",
//     password: "123456789",
//     phoneNumber: "1234567895"
// }


// const user= {
//     "firstName":"kaushik",
//     "lastName": "kumar",
//     "phoneNumber":"8558477877",
//     "email": "kausfhikaa@email.com",
//     "role":"admidn",
//     "password": "12345678"
// }



// console.log(userSchema.validate(user, { abortEarly: false }).error?.details)




module.exports = userSchema;