const makeValidationError = require("../etc/makeValidationError");
const errorMessages = require('../validationSchema/errorMessages');


// const validateSchema = function (schema) {

//     return function (req, res, next) {
//         const content = req.body;
//         const validation = schema.validate(content, { abortEarly: false });

//         if (validation.error) {
//             const errors = makeValidationError(validation.error?.details || []);
//             console.log(errors);
//             return res.status(422).json({ status: 422, message: "Invalid parameters.", data: errors });
//         } else {
//             next()
//         }
//     }
// }


const validateSchema = function (schema, toValidate = "body") {
    return function (req, res, next) {
        let payload;
        if (toValidate === 'body') {
            payload = req.body;
        } else if (toValidate === 'path') {
            payload = req.params;
        } else if (toValidate === 'query') {
            payload = req.query;
        }

        const options = {
            abortEarly: false,
            messages: errorMessages,
        };

        const validation = schema.validate(payload, options);
        console.log(payload, ":::::::::::");
        // console.dir(validation,{depth:5})

        if (validation.error) {
            const errors = validation.error.details.map(detail => {
                const message = String(detail.message);
                return message.replaceAll('"', '');
            });
            return res.status(422).json({
                status: 422,
                message: 'Invalid parameters',
                data: errors
            });
        } else {
            next();
        }
    }
};


module.exports = validateSchema;




