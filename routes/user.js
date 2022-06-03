const { Router } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const { registerValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200 } = require('../utils/variables');
const User = require('../models/user');

const router = Router(); 

/**
 * @swagger
 * /api/user/:
 *  get:
 *   summary: Получить список всех пользователей
 *   tags: [User]
 *   parameters:
 *    - in: query
 *      name: Pagination
 *      schema:
 *         type: object
 *         required:
 *            - skip
 *            - limit
 *         properties:
 *             skip:
 *                 type: number
 *             limit:
 *                 type: number
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/', async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const users = await User.find({isDeleted: false}).skip(skip || 0).limit(limit || 0).select('firstName lastName login');
        const usersMaxLength = await User.countDocuments({isDeleted: false});
        res.status(200).json({users, usersMaxLength});
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/user/about:
 *  get:
 *   summary: Получить тукушего автаризованного пользователя
 *   tags: [User]
 *   responses:
 *      200:
 *       description: Вернется данные авторизованного пользователя
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/about', async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId).select('-password -__v');
        res.status(200).json(user);
    } catch (e) {
        console.log(user);
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/user/register:
 *  post:
 *   summary: Зарегестрировать новый пользователь
 *   tags: [User]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *   responses:
 *      201:
 *       description: Успешно создали пользователя
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));
        
        const { login, password, firstName, lastName } = req.body;
        
        const candidate = await User.findOne({ login: login.trim() });
        if (candidate) return res.status(400).json('Пользователь с таким логином уже существует!');
        
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            login: login.trim().toLowerCase(),
            password: hashPassword
        };

        await (new User(newUser)).save();

        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});


/**
 * @swagger
 * /api/user/{userId}:
 *  delete:
 *   summary: Удалить пользователя
 *   tags: [User]
 *   parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: Ввести ID пользователя
 *   responses:
 *      200:
 *       description: Успешно удалено
 *      500:
 *       description: Что-то пошло не так
 */
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params);

        const user = await User.findById(userId);
        user.isDeleted = true;
        await user.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
})

module.exports = router;