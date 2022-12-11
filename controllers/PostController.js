import PostModel from '../models/post.js' 
import CommentModel from '../models/comment.js'



export const getNewPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        const postsSorted = posts.sort((a, b) => {
            if (a.createdAt > b.createdAt) return 1 
            if (a.createdAt === b.createdAt) return 0 
            if (a.createdAt < b.createdAt) return -1
        })
        res.json(postsSorted.reverse())
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        }) 
    }
}

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        const postsSorted = posts.sort((a, b) => {
            if (a.viewsCount > b.viewsCount) return 1 
            if (a.viewsCount === b.viewsCount) return 0 
            if (a.viewsCount < b.viewsCount) return -1
        })
        res.json(postsSorted.reverse())
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        }) 
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findOneAndUpdate({
            _id: postId
        }, {
            $inc: {viewsCount: 1}
        }, {
            returnDocument: 'after'
        }).populate('user')
        res.json(doc)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        }) 
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId
        }).exec((err, doc) => {
            doc.commentsIds.forEach( async (docId) => {
                console.log(docId._id)
                await CommentModel.findOneAndDelete({
                    _id: docId._id
                })
            })
            res.json({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        }) 
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.findOneAndUpdate({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
} 

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().exec()
        const postsSorted = posts.sort((a, b) => {
            if (a.createdAt > b.createdAt) return 1 
            if (a.createdAt === b.createdAt) return 0 
            if (a.createdAt < b.createdAt) return -1
        })
        const tags = postsSorted.reverse().map(obj => obj.tags).flat()
        const tagsUnique = tags.filter((t, index, tagsImagine) => {
            return tagsImagine.indexOf(t) === index
        })
        res.json(tagsUnique.splice(0, 5))
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить теги'
        }) 
    }
}

export const getPopularTags = async (req, res) => {
    try {
        const posts = await PostModel.find().exec()
        const postsSorted = posts.sort((a, b) => {
            if (a.viewsCount > b.viewsCount) return 1 
            if (a.viewsCount === b.viewsCount) return 0 
            if (a.viewsCount < b.viewsCount) return -1
        })
        const tags = postsSorted.reverse().map(obj => obj.tags).flat()
        const tagsUnique = tags.filter((t, index, tagsImagine) => {
            return tagsImagine.indexOf(t) === index
        })
        res.json(tagsUnique.splice(0, 5))
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить теги'
        }) 
    }
}
export const getPostsByTags = async (req, res) => {
    try {
        const tag = req.params.tag;
        console.log(req.params)
        console.log(tag)
        const posts = await PostModel.find({tags: {$elemMatch: {$eq: tag }}}).populate('user')
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        }) 
    }
}
export const search = async (req, res) => {
    try {
        const title = req.params.title
        const posts = await PostModel.find({title: {$regex: title}}).populate('user')    
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        }) 
    }
}