import express from 'express'
import cors from 'cors'
import { registerValidation, loginValidation, logoutValidation, postCreateValidation, postUpdateValidation, commentCreateValidation, updateMeValidation } from './validations/validations.js'
import { UserController, PostController, CommentController, ImageController } from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { uploadMiddleware } from './controllers/ImageController.js';


const app = express();

app.use(express.json()) // научили express читать json
app.use(cors())


app.post('/upload', checkAuth, uploadMiddleware, ImageController.uploadImg)
app.get('/upload/:id', ImageController.getImg)
app.delete('/upload/:id', checkAuth, ImageController.removeImg)


app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.patch('/auth/logout', logoutValidation, handleValidationErrors, UserController.logout)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

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
app.patch('/posts/edit/:id', checkAuth, postUpdateValidation, handleValidationErrors, PostController.update)
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