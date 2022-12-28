import { PostModel } from '../conn.js'
import { CommentModel } from '../conn.js'




export const getAll = async (req, res) => {
    try {
        const postId = req.params.postId
        const comments = await CommentModel.find({ post: { $eq: postId } })
            .populate('user').populate('post')

        const fixedComm = comments.map((c) => {
            c.user = {
                fullName: c.user.fullName,
                avatarUrl: c.user.avatarUrl,
                _id: c.user._id
            }
            return c
        })
        res.json(fixedComm)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить комментарии'
        })
    }
}
export const create = async (req, res) => {
    try {
        const postId = req.params.postId
        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId,
            post: postId
        })
        let _id = doc._id
        const comment = await (await doc.save()).populate('user post')
        PostModel.findOneAndUpdate({
            _id: postId
        }, {
            $inc: { commentsCount: 1 },
            $push: {
                'commentsIds': { _id }
            }
        }, { returnDocument: 'after' },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }
            }).populate('user')
        res.json(comment)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}
export const getLastComments = async (req, res) => {
    try {
        const comments = await (await CommentModel.find().populate('user')).splice(0, 5)
        const fixedComm = comments.map((c) => {
            c.user = {
                fullName: c.user.fullName,
                avatarUrl: c.user.avatarUrl
            }
            return c
        })
        res.json(fixedComm)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}
export const removeComment = async (req, res) => {
    try {
        // console.log(req.params)
        const id = req.params.commentId
        const postId = req.params.postId
        await CommentModel.findOneAndDelete({
            _id: id
        })
        await PostModel.findOneAndUpdate({
            _id: postId
        }, {
            $inc: { commentsCount: -1 }
        }, {
            returnDocument: 'after'
        }).then(() => {
                res.json({
                    success: true
                })
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}
export const updateComment = async (req, res) => {
    try {
        const id = req.params.commentId
        // const postId = req.params.postId
        await CommentModel.findOneAndUpdate({
            _id: id
        }, {
            text: req.body.text
        })
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}
