const router = require('express').Router();

const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');



router.get('/', (req, res) => {
    return res.render("index");
})

// router.post('/signup', joiValidation(userValidationSchema), async (req, res) => {
//     const user = req.body;

//     try {
//         const newUser = await new USER_MODEL(user).save();
//         return res.json({ data: newUser, error: {} });
//     } catch (err) {
//         console.log(err);
//         if (err?.code === 11000) {
//             return res.status(409).json({ status: 409, message: "User already exists." });

//         }
//         return res.status(400).json({ status: 400, message: "Bad Request!" });
//     }

// })



// router.post('/generateToken', joiValidation(loginValidationSchema), async function (req, res) {
//     const payload = req.body;

//     try {
//         const user = await USER_MODEL.findOne({
//             email: req.body.email,
//             // isDeleted: false,
//         }).lean();

//         // console.log(user, req.body);

//         if (!user) {
//             return res.status(403).json({ data: {}, error: { message: "Invalid email or password." } });
//         }

//         if (user.email === payload.email && bcrypt.compareSync(payload.password, user.password)) {
//             const token = await jwt.sign({ email: user.email, role: user.role }, process.env.SECRET);
//             return res.json({ status: 200, token: `Bearer ${token}` });
//         }

//         return res.status(403).json({ status: 403, message: "Invalid email or password." });


//     } catch (err) {
//         console.log(err);
//         return res.status(403).json({ status: 403, message: "Invalid email or password." });
//     }
// });



router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/',userRouter);

module.exports = router;