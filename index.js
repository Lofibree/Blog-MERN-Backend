import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose';
import fs from 'fs'
import cors from 'cors'
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation, updateMeValidation } from './validations/validations.js'
import { UserController, PostController, CommentController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'



mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db err', err))

const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json()) // научили express читать json
app.use(cors())
app.use('/uploads', express.static('uploads')) // объфсняем express что есть папка со статическими файлами

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    }) 
})

app.get('/posts/new', PostController.getNewPosts)
app.get('/posts/popular', PostController.getPopularPosts)
app.get('/tags/new', PostController.getLastTags)
app.get('/tags/popular', PostController.getPopularTags)
app.get('/tags/:tag', PostController.getPostsByTags)
app.get('/posts/:id', PostController.getOne)
app.get('/comments/:postId', CommentController.getAll)
app.get('/comments', CommentController.getLastComments)
app.get('/search/:title', PostController.search)

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.patch('/comments/:postId/:commentId', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.updateComment)
app.post('/comments/:postId', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create)
app.delete('/comments/:postId/:commentId', checkAuth, CommentController.removeComment)
app.patch('/personal/edit', checkAuth, updateMeValidation, handleValidationErrors, UserController.update)


app.listen(process.env.PORT || 4000, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('ok')
})