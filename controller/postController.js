const { POST_MODEL, COMMENT_MODEL, USER_MODEL } = require('../models/');
const { ADMIN, USER } = require('../etc/roles');
const createPayload = require('../etc/createPayload')

const s = require('mongoose')


const getPostById = async (req, res) => {
    const { user, body, params } = req;
    const postId = params.id;

    try {
        const post = await POST_MODEL.findOne({ isDeleted: false, _id: postId })
            .populate({
                path: 'author',
                // match: { isDeleted: false },
                select: '-_id -role -posts -comments -password',

            })
            .populate({
                path: 'comments',
                match: { isDeleted: false },
                // select: '-_id -role -posts -comments',

            })

            .lean();

        if (post) {
            return res.json({ status: 200, data: post, message:"Post fetched succsessfully."})
        } else {
            return res.status(404).json({ status: 404, message: "Post with the give id cannot be found." });
        }
    } catch (err) {
        console.log("::::::::::Error::::::::", err);
        return res.status(400).json({ status: 404, message: "Bad request!" })
    }

};

const getAllPosts = async (req, res) => {
    try {
        const posts = await POST_MODEL.find({ isDeleted: false })
            .populate({
                path: 'author',
                // match: { isDeleted: false },
                select: '-_id -role -posts -comments -password',

            })
            .populate({
                path: 'comments',
                match: { isDeleted: false },
                // select: '-_id -role -posts -comments',

            })
            .lean();

        return res.json({ status: 200, data: posts, message: 'Post fetched successfully.' })
    } catch (err) {
        console.log("::::::::::Error::::::::", err);
        return res.status(500).json({ status: 500, data: posts, message: "something went wrong!!" })
    }
};

const createPost = async (req, res) => {
    const { user, body } = req;

    try {
        const post = await new POST_MODEL({ ...body, author: user._id }).save();

        if (post) {
            await USER_MODEL.findByIdAndUpdate(user._id, { $push: { posts: post._id } })
        }
        return res.json({ status: 200, data: createPayload(post,['comments']), message: "Post created successfully." })

    } catch (err) {
        console.log("::::::::::Error::::::::", err);
        return res.status(400).json({ status: 400, message: "Bad request!" })
    }


};

const deletePost = async (req, res) => {
    const { user, params } = req;
    const postId = params.id;

    try {
        const post = await POST_MODEL.findOne({ _id: postId, isDeleted: false }, { title: 1, body: 1, author: 1, _id: 0 });

        //check if the post with the given id is there or not
        if (!post) {
            return res.status(404).json({ status: 404, message: "Post with the given id cannot be found." })
        }
        //checking if the post belongs to the user before deleting the post
        if (!canDeleteOrUpdate(post, user)) {
            return res.status(403).json({ status: 403, message: "You are unauthrize to do this action." })
        }

        //otherwise let the user delete the post
        await POST_MODEL.findOneAndUpdate({ _id: postId, isDeleted: false }, {
            $set: {
                isDeleted: true,
                deletedBy: user._id,
                deletedAt: new Date(),
            }
        });

        // TODO: delete comment here too
        await COMMENT_MODEL.updateMany({ post: postId }, {
            $set: {
                isDeleted: true,
                deletedBy: user._id,
                deletedAt: new Date(),
            }
        });

        return res.json({ status: 200, data: post, message: "Post deleted successfully!" });

    } catch (err) {
        console.log("::::::::::Error::::::::", err);
        return res.status(400).json({ status: 400, message: "Bad request!" });
    }

}

const updatePost = async (req, res) => {
    const { user, params, body } = req;
    const postId = params.id;

    try {
        const post = await POST_MODEL.findOne({ _id: postId, isDeleted: false }, { title: 1, body: 1, author: 1, _id: 0 }).lean();

        //check if the post with the given id is there or not
        if (!post) {
            return res.status(404).json({ status: 404, message: "Post with the given id cannot be found." })
        }

        //checking if the post belong to the user updating the post
        if (!canDeleteOrUpdate(post, user)) {
            return res.status(403).json({ status: 403, message: "You are unauthrize to do this action." })
        }

        //otherwise let the user update the post
        await POST_MODEL.findByIdAndUpdate(postId, { $set: { ...body, updatedBy: user._id } })

        return res.json({ status: 200, message: "Post updated successfully!", data: post });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: 400, message: "Bad request!" });
    }

}


const isOwner = (post, user) => {
    return post.author.toString() == user._id.toString();
}

const isAdmin = (user) => {
    return user.role == ADMIN;
}


const canDeleteOrUpdate = (post, user) => {
    return isAdmin(user) || isOwner(post, user);
}


module.exports = {
    getAllPosts,
    createPost,
    deletePost,
    updatePost,
    getPostById,
}











