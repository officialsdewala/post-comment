const router = require('express').Router();
const { commentController } = require('../controller');
const isAuth = require('../middlewares/authMiddleware');
const { ADMIN, USER } = require('../etc/roles');
const joiValidation = require('../middlewares/joiValidationMiddleware');
const commentSchema = require('../validationSchema/comment')

const { obejectIdValidationSchema, commentIdAndPostIdValidationSchema } = require('../validationSchema/objectIDValidationSchema')

const { createComment, getAllComment, deleteComment, updateComment, getCommentById } = commentController;


router.get('/:commentId', isAuth(), getCommentById);



router.get('/', isAuth([ADMIN]), getAllComment);
router.post('/:postId', isAuth([USER, ADMIN]), joiValidation(commentSchema), joiValidation(obejectIdValidationSchema, 'path'), createComment);
router.put('/:commentId', isAuth([USER, ADMIN]), joiValidation(commentSchema), joiValidation(obejectIdValidationSchema, 'path'), updateComment);
router.delete('/:postId/:commentId', isAuth([USER, ADMIN]), joiValidation(commentIdAndPostIdValidationSchema, 'path'), deleteComment);


module.exports = router;