const Joi = require('joi');
const { ObjectId } = require('mongoose').Types

function validateObjectId(value, helper) {
    if (ObjectId.isValid(value)) {
        return true;
    } else {
        return helper.message("Please enter valid {#label}.")
    }
}

const obejectIdValidationSchema = Joi.object({
    id: Joi.string().custom(validateObjectId),
    commentId: Joi.string().custom(validateObjectId),
    postId: Joi.string().custom(validateObjectId),
}).xor('id', 'commentId', 'postId');


const commentIdAndPostIdValidationSchema = Joi.object({
    commentId: Joi.string().required().custom(validateObjectId),
    postId: Joi.string().required().custom(validateObjectId)
});




// const user = {
//     commentId: '641044134f91fbba78690476',
//     postId:"641044134f91fbba78690476"
// }


// console.log(commentIdAndPostIdValidationSchema.validate(user)?.error?.details,{abortEarly:false});


module.exports = { obejectIdValidationSchema, commentIdAndPostIdValidationSchema };