const { Router } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const { registerValidator } = require('../utils/validator');
const { validatorJsonData, deleteTokenAndClearCookies } = require('../utils/func-helpers');
const { errMsg500, msg201 } = require('../utils/variables');
const User = require('../models/user');

const router = Router();

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

router.delete('/logout', async (req, res) => {
    try {
        const { refresh_token } = req.cookies;
        deleteTokenAndClearCookies(res, refresh_token, 200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;