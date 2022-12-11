import jwt from 'jsonwebtoken'






export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123')
            // console.log(decoded)
            req.userId = decoded._id // decoded._id из разшифрованного токена, этот _id я вшиваю в req, чтобы потом по желанию достать id пользователя
            next()
        } catch (e) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }

    // next(); // next говорит, что норм, можно идти дальше
}