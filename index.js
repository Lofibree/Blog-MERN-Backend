import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose';
import fs from 'fs'
import cors from 'cors'
import { registerValidation, loginValidation, logoutValidation, postCreateValidation, postUpdateValidation, commentCreateValidation, updateMeValidation } from './validations/validations.js'
import { UserController, PostController, CommentController, ImageController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
// import bodyParser


mongoose
    .connect(process.env.MONGODB_URI || 'mongodb+srv://lofi:wwwwww@cluster0.nyole5c.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db ok'))
    .catch((err) => console.log('db err', err))

const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        // if (!fs.existsSync('uploads')) {
        //     fs.mkdirSync('uploads')
        // }
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

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
 
// // Set EJS as templating engine
// app.set("view engine", "ejs");

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.patch('/auth/logout', logoutValidation, handleValidationErrors, UserController.logout)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), ImageController.uploadImg)
app.delete('/upload', checkAuth, ImageController.deleteImg)

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
app.patch('/posts/edit/:id',
    checkAuth,
    postUpdateValidation,
    handleValidationErrors,
    PostController.update
)
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