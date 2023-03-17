const { POST_MODEL, USER_MODEL, COMMENT_MODEL } = require('../models/');
const { ADMIN, USER } = require('../etc/roles');
const createPayload = require('../etc/createPayload')


const getAllComment = async (req, res) => {
	const { user, params } = req;
	try {
		const comments = await COMMENT_MODEL.find({ isDeleted: false })
			.populate({
				path: 'author',
				// match: { isDeleted: false },
				select: '-_id -role -posts -comments -password',
			})
			.populate({
				path: 'post',
				// match: { isDeleted: false },
				select: '-_id -role -posts -comments -password',
				populate: {
					path: 'author',
					select: "-_id -role -posts -comments -password",
				}
			})
			.lean();

		return res.json({ status: 200, message: "Comments fetched successfully.", data: comments })
	} catch (err) {
		console.log("::::::::::Error::::::::", err);
		return res.status(400).json({ status: 400, message: "Bad request!" });
	}

}

const getCommentById = async (req, res) => {
	const { user, params } = req;

	const commentId = params.commentId;

	try {
		// find the  comment by id
		const comment = await COMMENT_MODEL.findOne({ _id: commentId, isDeleted: false })
			.populate('post')
			.populate({
				path: 'author',
				select: 'firstName lastName -_id'
			})
			.populate({
				path: 'post',
				match: { isDeleted: false },
				select: 'title body comments',
			})
			.lean();

		//check if comment found or not by the given id
		if (comment) {
			return res.json({ status: 200, message: "Comment fetched successfully.", data: comment })
		}
		return res.status(200).json({ status: 404, message: "No comment found with the given id." })

	} catch (error) {
		console.log(error);
		return res.status(400).json({ status: 400, message: "Bad request." })
	}
}

const createComment = async (req, res) => {
	const { body, user, params } = req;
	const postId = params.postId;

	try {
		//comment created  here
		const comment = await new COMMENT_MODEL({ ...body, author: user._id, post: postId }).save();

		//getting comment and user 
		const post = await POST_MODEL.findByIdAndUpdate(postId, { $push: { comments: comment } });
		const dbuser = await USER_MODEL.findByIdAndUpdate(user._id.toString(), { $push: { comments: comment._id } });


		return res.json({ status: 200, message: "Comments created successfully.", data: createPayload(comment, ['author', 'post']) })

	} catch (err) {
		console.log(err);
		return res.status(400).json({ status: 400, message: "Bad request!" });
	}

}


const updateComment = async (req, res) => {
	const { body, user, params } = req;

	const commentId = params.commentId;

	const newComment = body;

	console.log("body", newComment);

	try {

		// find the  comment by id
		const comment = await COMMENT_MODEL.findOne({ _id: commentId, isDeleted: false }).lean();

		//check if the comment with the given id is there or not
		if (!comment) {
			return res.status(404).json({ status: 404, message: "Comment with the given id cannot be found." })
		}

		if (!canUpdateComment(comment, user)) {
			return res.status(403).json({ status: 403, message: "You are unauthrize to do this action." })
		}

		const updatedcomment = await COMMENT_MODEL.findOneAndUpdate({ _id: commentId, isDeleted: false }, { $set: { ...newComment } }).lean();

		return res.json({ status: 200, data: updatedcomment, message: "Comment created successfully." });

	} catch (err) {
		console.log(err);
		return res.status(400).json({ status: 400, message: "Bad request." })
	}


}

const deleteComment = async (req, res) => {
	const { body, user, params } = req;

	const postId = params.postId;
	const commentId = params.commentId;

	try {
		// find the post and comment by id
		const post = await POST_MODEL.findOne({ _id: postId, isDeleted: false }).lean();
		const comment = await COMMENT_MODEL.findOne({ _id: commentId, isDeleted: false }).lean();

		//check if the comment with the given id is there or not
		if (!post || !comment) {
			return res.status(404).json({ status: 404, message: "Comment  or the post is invalid." })
		}

		//check if user can delete the comment
		if (!canDeleteComment(post, comment, user)) {
			return res.status(403).json({ status: 403, message: "You are unauthrize to do this action." })
		}

		// if user can delete the comment then delete it
		await POST_MODEL.findOneAndUpdate({ _id: postId, isDeleted: false });	
		const deletedComment = await COMMENT_MODEL.findOneAndUpdate({ _id: commentId, isDeleted: false },
			{ $set: { isDeleted: true, deletedAt: new Date(), deletedBy: user._id } }).lean();

		// comment.isDeleted = true;
		// comment.deletedAt = new Date();
		// comment.deletedBy = user._id;
		// await comment.save();

		return res.json({ status: 200, data: deletedComment, message: "Comment deleted successfully" });

	} catch (err) {
		return res.status(400).json({ status: 400, message: "Bad request!" })
	}


}


const isOwnerOfPost = (post, user) => {
	return post.author.toString() == user._id.toString();
}

const isOwnerOfComment = (comment, user) => {
	return comment.author.toString() == user._id.toString();
}

const isAdmin = (user) => {
	return user.role == ADMIN;
}

const canDeleteComment = (post, comment, user) => {
	return isAdmin(user) || isOwnerOfPost(post, user) || isOwnerOfComment(comment, user);
}

const canUpdateComment = (comment, user) => {
	return isAdmin(user) || isOwnerOfComment(comment, user);
}




module.exports = {
	getAllComment,
	getCommentById,
	createComment,
	deleteComment,
	updateComment,
}