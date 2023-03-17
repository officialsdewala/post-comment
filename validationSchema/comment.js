const Joi = require('joi');

const errorMessages = {
    'any.required': "Post {#label}  is required",
    'any.unknown' : "Unknown field {#label}",
}

const commentSchema = Joi.object({
    text: Joi.string()
        .required(),
});

// console.log(commentSchema.validate({text:"pl"}))

module.exports = commentSchema;

