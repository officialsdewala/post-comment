const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    isDeleted: { type: Boolean, default: false, select: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", select: false },
    deletedAt: { type: Date, default: null, select: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null, select: false },
    createdAt: { type: mongoose.Schema.Types.Date, select: false },
    updatedAt: { type: mongoose.Schema.Types.Date, select: false },
    __v: { type: Number, select: false },

}, { timestamps: true });

const COMMENT_MODEL = mongoose.model("comment", commentSchema);

module.exports = COMMENT_MODEL;