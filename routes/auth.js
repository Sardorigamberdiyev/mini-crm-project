const { Router } = require('express');
const { validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { loginValidator } = require('../utils/validator');
const { errMsg500, errMsgLogin400, msgLogin200 } = require('../utils/variables');
const { validatorJsonData } = require('../utils/func-helpers');
const User = require('../models/user');
const Token = require('../models/token');

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *   summary: Войти в систему
 *   tags: [Auth]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  properties:
 *                    login:
 *                        type: string
 *                        description: Логин пользователя
 *                    password:
 *                        type: string
 *                        description: Пароль пользователя
 *                  required:
 *                        - login
 *                        - password
 *                  example:
 *                        login: sardor123
 *                        password: s1234567
 *   responses:
 *      200:
 *       description: Успешно вошли в систему
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/login', loginValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { login, password } = req.body;

        const user = await User.findOne({login: login.toLowerCase()});
        if (!user) return res.status(400).json(errMsgLogin400);

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) return res.status(400).json(errMsgLogin400);

        const payload = { userId: user._id.toString(), role: user.role };
        const accessToken = jwt.sign(payload, config.get('accessJwtSecretKey'), { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, config.get('refreshJwtSecretKey'), { expiresIn: '72h' });

        const newRefreshToken = { userId: user._id, refreshToken };
        await (new Token(newRefreshToken)).save();

        const cookieAccessOption = {httpOnly: true};
        const cookieRefreshOption = {httpOnly: true, maxAge: 1000 * 60 * 60 * 72};
        res.cookie('access_token', accessToken, cookieAccessOption);
        res.cookie('refresh_token', refreshToken, cookieRefreshOption);
        res.cookie('logged_in', 'yes');

        res.status(200).json(msgLogin200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;