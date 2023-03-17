const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({

    "title": { type: String, required: true },
    "body": { type: String, required: true },
    "author": { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    "comments": [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment', required: true }],
    "isDeleted": { type: Boolean, default: false, select: false, },
    "deletedBy": { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null, select: false },
    "deletedAt": { type: Date, default: null, select: false, },
    "updatedBy": { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null, select: false },
    createdAt: { type: mongoose.Schema.Types.Date, select: false },
    updatedAt: { type: mongoose.Schema.Types.Date, select: false },
    __v: { type: Number, select: false },

}, { timestamps: true });


const POST_MODEL = mongoose.model('post', postSchema);

module.exports = POST_MODEL;