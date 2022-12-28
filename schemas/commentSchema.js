import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        // unique: true
    },
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
}, {
    timestamps: true, // при создании любого пользователя mongodb должен прикреплять дату создания и обновления этой сущности
})

// export default mongoose.model('Comment', CommentSchema)
export default CommentSchema;