import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 5 символов длиной').isLength({ min: 5 }),
    body('fullName', 'Укажите имя, длиной хотя бы 3 символа').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на автарку').optional().isURL(),
] 
export const updateMeValidation = [
    body('avatarUrl', 'Неверная ссылка на автарку').optional().isURL(),
] 
export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
] 
export const postUpdateValidation = [
    body('title', 'Введите заголовок статьи').optional().isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').optional().isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
    body('image', 'Неверный id изображения').optional().isString(),
] 
export const commentCreateValidation = [
    body('text', 'Введите текст комментария').isLength({ min: 10 }).isString(),
] 
export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 5 символов длиной').isLength({ min: 5 }),
] 
export const logoutValidation = [
    body('email', 'Неверный формат почты').isEmail(),
] 