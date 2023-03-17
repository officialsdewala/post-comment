const Joi = require('joi');


const postSchema = Joi.object({
    title: Joi.string()
        .required(),

    body: Joi.string()
        .required(),
})


// console.log(postSchema.validate({}, { abortEarly: false }).error.details)




module.exports = postSchema;