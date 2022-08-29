const { body, check } = require('express-validator');

exports.registerValidator = [
    body('firstName', 'Поля имя обязательное').isLength({ min: 1 }),
    body('lastName', 'Поля фамилия обязательное').isLength({ min: 1 }),
    body('login', 'Введите коректное значение').isAlphanumeric().isLength({ min: 3, max: 24 }),
    body('password', 'Пароль должен содержать мин. 1-буква, мин. 1-цифру, мин. 8-символов').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    // body('confirm').custom((value, { req }) => {
    //     const { password } = req.body;
    //     if (password !== value) throw new Error('Пароли должны совпадать');
    //     return true;
    // }),
    // body('role').custom((value) => {
    //     const roles = ['user'];
    //     if (!roles.includes(value)) throw new Error('Не коректный роль. (user)');
    //     return true;
    // })
];

exports.orderValidator = [
    body('firm').custom((value) => {
        const allowedFirms = ['firm-1', 'firm-2'];
        if (!allowedFirms.includes(value)) 
            throw new Error('Значение должен быть firm-1 или firm-2');
        
        return true;
    }),
    body('dateIssue', 'Ведите правильный формат дата').isLength({ min: 1 }),
    body('senderStation', 'Поля станция отправителя обязательное').isLength({ min: 1 }),
    body('arrivalStation', 'Поля станция получателя обязательное').isLength({ min: 1 }),
    body('customerId', 'Поля плательщик обязательное').isLength({ min: 1 }),
    body('sender', 'Поля отправитель обязательное').isLength({ min: 1 }),
    body('recipient', 'Поля получатель обязательное').isLength({ min: 1 }),
    body('cargoType', 'Поля тип груза обязательное').isLength({ min: 1 }),
    body('carriageId', 'Поля вагон обязательное').isLength({ min: 1 }),
    body('carriageCount', 'Поля кол-во вагонов должен быть числовым').isNumeric(),
    body('capacity', 'Поля объем должен быть числовым').isNumeric(),
    body('territoryTransportation.*.customHouseFeeId').isLength({ min: 1 }),
    body('territoryTransportation.*.firstCode').isNumeric(),
    body('territoryTransportation.*.lastCode').isNumeric(),
    body('generalRate', 'Поля должен быть числовым').isNumeric(),
    body('additionalFee', 'Поля должен быть числовым').isNumeric(),
    body('pricePerTon', 'Поля должен быть числовым').isNumeric(),
    body('tlg.uzsPrice', 'Поля должен быть числовым').isNumeric(),
    body('tlg.usdPrice', 'Поля должен быть числовым').isNumeric()
]

exports.countryValidator = [
    body('name', 'Поля наз. обязатаельное поле').isLength({ min: 1 })
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