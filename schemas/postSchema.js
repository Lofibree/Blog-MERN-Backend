import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: []
    },
    commentsIds: {
        type: Array,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // связь между таблицами 
        required: true,
    },
    image: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Image',
        required: false
    },
}, {
    timestamps: true, // при создании любого пользователя mongodb должен прикреплять дату создания и обновления этой сущности
})

export default PostSchema;