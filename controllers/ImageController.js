import path from 'path'
import crypto from 'crypto'
import { GridFsStorage } from 'multer-gridfs-storage'
import conn, {PostModel} from '../conn.js';
import mongoose from 'mongoose';
import multer from 'multer'



let gfs;
conn.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'images'
    })
})
 
const storage = new GridFsStorage({
    url: 'mongodb+srv://lofi:wwwwww@cluster0.nyole5c.mongodb.net/blog?retryWrites=true&w=majority',
    options: {useUnifiedTopology: true},
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename, bucketName: 'images' 
                }
                resolve(fileInfo)
            })
        })
    }
})

const store = multer({
    storage: storage,
    limits: {fileSize: 20000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})

const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) return cb(null, true)
    cb('filetype')
}

export const uploadMiddleware = (req, res, next) => {
    const upload = store.single('image');
    upload(req, res, function(err){
        if (err instanceof multer.MulterError) {
            return res.status(400).send('File too large')
        } else if(err) {
            if (err === 'filetype') return res.status(400).send('Image files only')
            return res.sendStatus(500)
        }
        next()
    })
}
export const uploadImg = async (req, res) => {
    const {file} = req;
    const {id} = file
    if (file.size > 5000000) {
        deleteImage(id)
        return res.status(400).send('file may not exceed 5mb')

    }
    console.log('uploaded file: ', file)
    return res.send(file.id)
}

const deleteImage = async (id) => {
    try {
        if (!id || id === 'undefined') return res.status(400).send('no image id')
        const _id = mongoose.Types.ObjectId(id)
        await gfs.delete(_id, err => {
            if (err) return console.log('image deletion error')
        })
    } catch (err) {
        console.log(err)
    }
}
export const removeImg = async (req, res) => {
    try {
        const id = req.params.id
        if (!id || id === 'undefined') return res.status(400).send('no image id') 
        await deleteImage(id)
        const _id = mongoose.Types.ObjectId(id)
        await PostModel.updateMany({
            image: _id
        }, {
            image: ""
        })
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Cant delete img'
        }) 
    }
}
export const getImg = async ({ params: { id } }, res) => {
    try {
        if (!id || id === 'undefined') return res.status(400).send('no image id')
        const _id = new mongoose.Types.ObjectId(id)
        await gfs.find({_id})
        .toArray((err, files) => {
            console.log(files)
            if (!files || files.length === 0) return res.status(400).send('no files exist')
            res.setHeader('Content-Type', 'image/jpeg')
            gfs.openDownloadStream(_id).pipe(res)
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Cant get img'
        })
    }
}


