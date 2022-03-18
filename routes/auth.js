const { Router } = require('express');
const { validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidator, loginValidator } = require('../utils/validator');
const { errMsg500, errMsgLogin400, msgLogin200 } = require('../utils/variables');
const { validatorJsonData } = require('../utils/func-helpers');
const isAuthMiddleware = require('../middlewares/isAuth');
const User = require('../models/user');
const Token = require('../models/token');

const router = Router();

router.post('/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));
        
        const { login, password, firstName, lastName, role } = req.body;

        const candidate = await User.findOne({ login: login.trim() });
        if (candidate) return res.status(400).json('Пользователь с таким логином уже существует!');
        
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            login: login.trim().toLowerCase(),
            password: hashPassword,
            role
        };

        const user = new User(newUser);
        await user.save();
        res.status(200).json('Пользователь успешно добавлено');
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.post('/login', loginValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { login, password } = req.body;

        const user = await User.findOne({login: login.toLowerCase()});
        if (!user) return res.status(400).json(errMsgLogin400);

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) return res.status(400).json(errMsgLogin400);

        const payload = { userId: user._id.toString() };
        const accessToken = jwt.sign(payload, config.get('accessJwtSecretKey'), { expiresIn: '30s' });
        const refreshToken = jwt.sign(payload, config.get('refreshJwtSecretKey'), { expiresIn: '60s' });

        const newRefreshToken = { userId: user._id, refreshToken };
        await (new Token(newRefreshToken)).save();

        const cookieAccessOption = { httpOnly: true, maxAge: 30 * 1000 };
        const cookieRefreshOption = { httpOnly: true, maxAge: 1000 * 60 };
        res.cookie('access_token', accessToken, cookieAccessOption);
        res.cookie('refresh_token', refreshToken, cookieRefreshOption);
        res.cookie('logged_in', 'yes');
        res.status(200).json(msgLogin200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.delete('/logout', isAuthMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;
        const { refresh_token } = req.cookies;
        await Token.deleteOne({ userId, refreshToken: refresh_token });
    
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.cookie('logged_in', 'no');
        res.status(200).json('Вы вышли из системы');
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;