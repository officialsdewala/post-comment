


function makeValidationError(errors) {
    const error = [];
    for (const e of errors) {
        error.push(e.message.replaceAll('"', ''));
    }

    return error;
}

module.exports = makeValidationError;