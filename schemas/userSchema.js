import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    isOnline: Boolean,
    avatarUrl: String,
}, {
    timestamps: true, // при создании любого пользователя mongodb должен прикреплять дату создания и обновления этой сущности
})

// export default mongoose.model('User', UserSchema)
export default UserSchema;