const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');

const { errMsg500, msg200 } = require('../utils/variables');
const { deleteTokenAndClearCookies } = require('../utils/func-helpers');
const router = Router();

router.get('/refresh/access', async (req, res) => {
    try {
        const { refresh_token } = req.cookies;

        jwt.verify(refresh_token, config.get('refreshJwtSecretKey'), async (err, decoded) => {
            if (err) return deleteTokenAndClearCookies(res, refresh_token, 401)

            const payload = { userId: decoded.userId };
            const cookieAccessOption = { httpOnly: true, maxAge: 30 * 1000 };
            const newAccessToken = jwt.sign(payload, config.get('accessJwtSecretKey'), { expiresIn: '30s' });
            res.cookie('access_token', newAccessToken, cookieAccessOption);
            res.status(200).json(msg200);
        })
    } catch (e) {
        res.status(500).json(errMsg500);
    }
})

module.exports = router;