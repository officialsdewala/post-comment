const router = require('express').Router();
const { postController } = require('../controller/')
const isAuth = require('../middlewares/authMiddleware')
const { ADMIN, USER } = require('../etc/roles')

const joiValidation = require('../middlewares/joiValidationMiddleware');
const postSchema = require('../validationSchema/post')
const { obejectIdValidationSchema, commentIdAndPostIdValidationSchema } = require('../validationSchema/objectIDValidationSchema')



const { createPost, getAllPosts, deletePost, updatePost, getPostById } = postController;

router.post('/', isAuth([USER, ADMIN]), joiValidation(postSchema), createPost);
router.get('/', isAuth([USER, ADMIN]), getAllPosts);
router.get('/:id', isAuth([USER, ADMIN]), joiValidation(obejectIdValidationSchema, 'path'), getPostById);
router.put('/:id', isAuth([USER, ADMIN]), joiValidation(postSchema), joiValidation(obejectIdValidationSchema, 'path'), updatePost);
router.delete('/:id', isAuth([USER, ADMIN]), joiValidation(obejectIdValidationSchema, 'path'), deletePost);





module.exports = router;