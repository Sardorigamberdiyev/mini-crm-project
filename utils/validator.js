const { body } = require('express-validator');

exports.registerValidator = [
    body('firstName', 'Поля имя обязательное').isLength({ min: 1 }),
    body('lastName', 'Поля фамилия обязательное').isLength({ min: 1 }),
    body('login', 'Введите коректное значение').isAlphanumeric().isLength({ min: 3, max: 24 }),
    body('password', 'Пароль должен содержать мин. 1-буква, мин. 1-цифру, мин. 8-символов').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    body('confirm').custom((value, { req }) => {
        const { password } = req.body;
        if (password !== value) throw new Error('Пароли должны совпадать');
        return true;
    }),
    body('role').custom((value) => {
        const roles = ['user'];
        if (!roles.includes(value)) throw new Error('Не коректный роль. (user)');
        return true;
    })
];

exports.loginValidator = [
    body('login', 'Введите логин').isLength({ min: 1 }),
    body('password', 'Введите пароль').isLength({ min: 1 })
];

exports.customerValidator = [
    body('name', 'Поля имя обязательное').isLength({ min: 1 }),
    body('phone', 'Поля тел. обязательное').isLength({ min: 1 })
];

exports.carriageValidator = [
    body('typeCarriage', 'Поля обязательное').isLength({ min: 1 })
]