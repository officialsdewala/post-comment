const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const joiValidation = require('../middlewares/joiValidationMiddleware');
const userValidationSchema = require('../validationSchema/user');
const loginValidationSchema = require('../validationSchema/login');

const { USER_MODEL } = require('../models')

const createPayload = require('../etc/createPayload')




router.post('/signup', joiValidation(userValidationSchema), async (req, res) => {
    const user = req.body;

    try {
        const newUser = await new USER_MODEL(user).save();
        return res.json({ status: 200, message: "Signed up scuccessfully.", data: createPayload(newUser, ['posts', 'comments']) });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ status: 409, message: "User already exists." });

        }
        console.log(err);
        return res.status(400).json({ status: 400, message: "Bad Request!" });
    }

})



router.post('/generateToken', joiValidation(loginValidationSchema), async function (req, res) {
    const payload = req.body;

    try {
        const user = await USER_MODEL.findOne({
            email: req.body.email,
            // isDeleted: false,
        }).lean();

        // console.log(user, req.body);

        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid email or password." });
        }

        if (user.email === payload.email && bcrypt.compareSync(payload.password, user.password)) {
            const token = await jwt.sign({ email: user.email, role: user.role }, process.env.SECRET);
            return res.json({ status: 200, message: "Token generated successfully.", token: `Bearer ${token}` });
        }

        return res.status(401).json({ status: 401, message: "Invalid email or password." });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ status: 401, message: "Invalid email or password." });
    }
});







module.exports = router;