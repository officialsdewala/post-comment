
module.exports = function createPayload(data = {}, exclude = [], include = []) {
    exclude = [...exclude, '__v', 'createdAt', 'updatedAt', 'updatedBy', 'password', 'deletedAt', 'deletedBy', 'isDeleted'];

    if ('toJSON' in data) {
        data = { ...data.toJSON() }
    }

    for (const field of exclude) {
        if (field in data) {
            delete data[field]
        }
    }
    return data;
}


// const createPayload = function (data = {}, exclude = [], include = []) {

//     if (!Array.isArray(exclude)) {
//         exclude = [String(exclude)];
//     };
//     if (!Array.isArray(include)) {
//         include = [String(include)];
//     }
//     exclude = [...exclude, ...excludeGlobal];

//     //   console.dir(data, { depth: 3 });
//     if ("toJSON" in data) {
//         data = { ...data.toJSON() };
//     }

//     for (const field of exclude) {
//          //if the field includes in the include array
//          //and if it is there then skip excluding
//         if (include.includes(field))
//             continue;

//         if (field in data) {
//             delete data[field];
//         }
//     }
//     // console.log(data);
//     return data;
// };