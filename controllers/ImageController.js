import PostModel from '../models/post.js' 
import fs from 'fs'
import path from 'path'
import ImageModel from '../models/image.js'

export const uploadImg = async (req, res) => {
    try {
        const fileRef = fs.readFileSync(path.join('C:/Java/first/full/', 'uploads/' + req.file.originalname))
        const a = Buffer.from(fileRef).toString('base64')
        const obj = new ImageModel({
            name: req.file.originalname,
            data: `data:image/jpg;base64,${a}`,
            contentType: 'image/png'
        })
        const image = await obj.save()
        res.json({...image})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось загрузить фото'
        }) 
    }
}
export const deleteImg = async (req, res) => {
    try {
        const imgId = req.body.imgId
        console.log(imgId)
        console.log(req.body)
        const deletedImg = await ImageModel.findOneAndDelete({
            _id: imgId
        })
        await PostModel.updateMany({
            image: imgId
        }, {
            $unset: {image: ''}
        })
        console.log(deletedImg)
        await fs.unlink(path.join('C:/Java/first/full/', 'uploads/' + deletedImg.name), (err) => {
            if (err) {
              console.error(err)
              return
            }
        })
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось загрузить фото'
        }) 
    }
}
