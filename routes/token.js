const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');

const { errMsg500, errMsg401, msg200 } = require('../utils/variables');
const Token = require('../models/token');
const router = Router();

router.get('/refresh/access', async (req, res) => {
    try {
        const { refresh_token } = req.cookies;

        const token = await Token.findOne({ refreshToken: refresh_token });
        console.log(token);
        if (!token) {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.cookie('logged_in', 'no');
            return res.status(401).json(errMsg401);
        }

        const { _id: tokenId, refreshToken } = token;

        jwt.verify(refreshToken, config.get('refreshJwtSecretKey'), async (err, { userId }) => {
            if (err) {
                await Token.findByIdAndDelete(tokenId);
                res.clearCookie('access_token');
                res.clearCookie('refresh_token');
                res.cookie('logged_in', 'no');
                return res.status(401).json(errMsg401);
            }

            const payload = { userId };
            const cookieAccessOption = { httpOnly: true, maxAge: 60 * 60 * 1000 };
            const newAccessToken = jwt.sign(payload, config.get('accessJwtSecretKey'), { expiresIn: '30s' });
            res.cookie('access_token', newAccessToken, cookieAccessOption);
            res.status(200).json(msg200);
        })
    } catch (e) {
        res.status(500).json(errMsg500);
    }
})

module.exports = router;