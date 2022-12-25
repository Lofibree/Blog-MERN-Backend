import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    // desc: String,
    // img: {
        name: String,
        data: String,
        contentType: String
    // },
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment', // связь между таблицами 
    //     required: true,
    // }],
    // imageUrl: String,
}, {
    timestamps: true, // при создании любого пользователя mongodb должен прикреплять дату создания и обновления этой сущности
})

export default mongoose.model('Image', ImageSchema)