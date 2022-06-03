const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');

const { errMsg500, msg200 } = require('../utils/variables');
const { deleteTokenAndClearCookies } = require('../utils/func-helpers');
const router = Router();

/**
 * @swagger
 * /api/token/refresh/access:
 *  get:
 *   summary: Получить новый access токен
 *   tags: [Token]
 *   responses:
 *      200:
 *       description: Успешно вышли из системы
 *      401:
 *       description: Когда рефреш токена нету
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/refresh/access', async (req, res) => {
    try {
        const { refresh_token } = req.cookies;

        jwt.verify(refresh_token, config.get('refreshJwtSecretKey'), async (err, decoded) => {
            if (err) return deleteTokenAndClearCookies(res, refresh_token, 401)

            const payload = { userId: decoded.userId };
            const cookieAccessOption = { httpOnly: true };
            const newAccessToken = jwt.sign(payload, config.get('accessJwtSecretKey'), { expiresIn: '1h' });
            res.cookie('access_token', newAccessToken, cookieAccessOption);
            res.status(200).json(msg200);
        })
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/token/logout:
 *  delete:
 *   summary: Выйти из системы, удаляет из куки токены
 *   tags: [Token]
 *   responses:
 *      200:
 *       description: Успешно вышли из системы
 *      500:
 *       description: Что-то пошло не так
 */
 router.delete('/logout', async (req, res) => {
    try {
        const { refresh_token } = req.cookies;
        deleteTokenAndClearCookies(res, refresh_token, 200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;