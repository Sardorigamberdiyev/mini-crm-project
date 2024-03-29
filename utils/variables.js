exports.errMsg401 = 'Нет авторизации';
exports.errMsg403 = 'Нет доступа';
exports.errMsg404 = 'Нет данный по запросу';
exports.errMsg500 = 'Что то пошло не так попробуйте заного';
exports.errMsgLogin400 = 'Введите коректный логин или пароль!';
exports.errMsgCarriageReturn400 = 'Кол-во вагонов должен быть больше возрата вагона!';
exports.errMsgCarriageCount400 = 'Кол-во вагонов не должен быть меньше кол-во возврата вагона!';
exports.msgLogin200 = 'Вы успешно вошли в систему';
exports.msgLogout200 = 'Вы успешно вышли из системы';
exports.msg201 = 'Успешно добавлено';
exports.msg200 = 'Успешно выполнено';
exports.msgDeleted200 = 'Успешно удалено';
exports.msgEdited200 = 'Успешно изменено';
exports.populateToPopulateOrder = {
    path: 'territoryTransportation.customHouseFeeId',
    select: '-__v',
    populate: [
        {path: 'carriageId', select: '-__v'},
        {path: 'countryId', select: '-__v'}
    ]
}