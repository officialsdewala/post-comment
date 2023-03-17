const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
    },

    email: {
        type: String,
    },

    profilePic: {
        type: String,
        default: null,
    },

    role: {
        type: String,
        default: "user",
    },

    password: {
        type: String,
    },

    posts: [
        { type: mongoose.Types.ObjectId, ref: 'post', },
    ],

    comments: [
        { type: mongoose.Types.ObjectId, ref: 'comment', }
    ],

    isDeleted: {
        type: Boolean,
        dafault: false,
        select: false,
    },

    deletedAt: {
        type: Date,
        deafualt: null,
        select: false,
    },

    deletedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'comment',
        default: null,
        select: false,
    },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null, select: false, },

    createdAt: { type: mongoose.Schema.Types.Date, select: false },
    updatedAt: { type: mongoose.Schema.Types.Date, select: false },
    __v: { type: Number, select: false },

}, { timestamps: true, autoIndex: true });


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        return next();
    }

    const user = this;

    try {
        password = await bcrypt.hash(user.password, 5);
        user.password = password;
        return next();
    } catch (err) {
        throw err;
    }
})

userSchema.index({ "email": 1, 'role': 1 }, { unique: true })

userSchema.ensure


const userModel=mongoose.model('user', userSchema);

userModel.ensureIndexes();

module.exports = userModel