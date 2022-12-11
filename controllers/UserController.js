import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/user.js'





export const register = async (req, res) => {
    try {
        const password = req.body.password.toString();
        const salt = await bcrypt.genSalt(10); // алгоритм шифрования пароля
        const hash = await bcrypt.hash(password, salt) // bcrypt шифрует пароль

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 'secret123',
            {
                expiresIn: '30d'
            }
        )
        
        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

// мб стоит logout сделать

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(400).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret123',
            {
                expiresIn: '30d'
            }
        ) 

        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => { // проверяем, может ли пользователь получить инфлрмацию о себе 
    try { // в checkAuth есть next(), которая позволяет идти дальше ((req, res) и тд)
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}

export const update = async (req, res) => {
    const id = req.userId
    const newAvatar = req.body.avatarUrl
    await UserModel.findOneAndUpdate({
        _id: id
    }, {
        avatarUrl: newAvatar
    })
    res.json({
        success: true
    })
}