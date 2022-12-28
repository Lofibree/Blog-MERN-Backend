import mongoose from "mongoose";
import CommentSchema from "./schemas/commentSchema.js";
import PostSchema from "./schemas/postSchema.js";
import UserSchema from "./schemas/userSchema.js";

const mongoURI = process.env.MONGODB_URI
const conn = mongoose.createConnection(mongoURI)
conn.asPromise().then(() => console.log('db ok')).catch((err) => console.log('db err', err))

export const UserModel = conn.model('User', UserSchema)
export const PostModel = conn.model('Post', PostSchema)
export const CommentModel = conn.model('Comment', CommentSchema)

export default conn;