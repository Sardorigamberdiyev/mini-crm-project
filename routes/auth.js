const { Router } = require('express');
const { validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidator } = require('../utils/validator');
const { errMsg500, errMsgLogin400 } = require('../utils/variables');
const { validatorJsonData } = require('../utils/func-helpers');
const User = require('../models/user');
const router = Router();

router.post('/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));
        
        const { login, password, firstName, lastName, role } = req.body;

        const candidate = User.findOne({ login: login.trim() });
        if (candidate) return res.status(400).json('Пользователь с таким логином уже существует!');
        
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            login: login.trim(),
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

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({login});
        if (!user) return res.status(400).json(errMsgLogin400);

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) return res.status(400).json(errMsgLogin400);

        const payload = { userId: user._id.toString() };
        const accessToken = jwt.sign(payload, config.get('accessJwtSecretKey'), { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, config.get('refreshJwtSecretKey'));
        res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;