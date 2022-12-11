import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true
    // },
    text: {
        type: String,
        required: true,
        // unique: true
    },
    // tags: {
    //     type: Array,
    //     default: []
    // },
    // viewsCount: {
    //     type: Number,
    //     default: 0
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // связь между таблицами 
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // связь между таблицами 
        required: true,
    },
    // imageUrl: String,
}, {
    timestamps: true, // при создании любого пользователя mongodb должен прикреплять дату создания и обновления этой сущности
})

export default mongoose.model('Comment', CommentSchema)