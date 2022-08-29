const Token = require('../models/token');
const { errMsg401, msgLogout200 } = require('../utils/variables');

exports.validatorJsonData = (errors) => ({errors: errors.array(), errMsg: 'Вы не прошли валидацию'});

exports.rowOrderItem = (order, countries) => {

    let territoryValue = '';
    order.territoryTransportation.forEach(({customHouseFeeId, firstCode, lastCode}) => {
        territoryValue += `${customHouseFeeId.countryId.name} ${firstCode}-${lastCode} \n`;
    });
    
    return {
        'Дата выдачи': order.dateIssue,
        '': territoryValue,
        'Ст.отправителя': order.senderStation,
        'Ст.назначения': order.arrivalStation,
        'Отправитель': order.sender,
        'Получатель': order.recipient,
        'Груз': `${order.carriageId.typeCarriage}/${order.cargoType}`,
        'Кол-во вагонов': order.carriageCount,
        'Возврат': order.carriageReturn,
        'Объем': order.capacity,
        ...this.countriesToObj(countries, order),
        'Обш.ставка': 0,
        'Доп.сбор': order.additionalFee,
        'Цена за тонну': 0,
        'ТЛГ Сумма': order.tlg.uzsPrice,
        'Доллар': order.tlg.usdPrice,
        'Общая цена': 0,
        'Кол ваг по факту': 0,
        'Объем по факту': order.capacity,
        'Цена/тон по факту': 0,
        'Общая цена по факту': 0,
        'Поступая': order.doing.cost,
        'Сальдо': 0,
        'Дополнительная информация': order.additionalInfo.infoText
    }
};

exports.deleteTokenAndClearCookies = async (res, refreshToken = null, status) => {
    try {
        if (refreshToken) await Token.findOneAndDelete({ refreshToken });
    } finally {
        const msg = status === 401 ? errMsg401 : msgLogout200;
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.cookie('logged_in', 'no');
        res.status(status).json(msg);
    }
};

exports.orderChangedProperties = (order, body) => {
    const { additionalFee, carriageCount, territorialTotalCost, capacity } = body;
    const { changedProperties } = order;

    const properties = changedProperties;
    const keys = Object.keys(body);
    
    keys.push('actualTotalPrice');

    const actualTotalPrice = (additionalFee * carriageCount) + (territorialTotalCost * capacity);

    keys.forEach((value) => {
        if (JSON.stringify(body[value]) !== JSON.stringify(order[value])) {
            if (value === 'tlg') {
                const { uzsPrice, usdPrice } = body[value];
                const { uzsPrice: cUzsPrice, usdPrice: cUsdPrice } = order[value];

                if (uzsPrice !== cUzsPrice || usdPrice !== cUsdPrice) 
                    properties.push(value);

            } else if (value === 'territoryTransportation') {
                const territoryTransportation = body[value];
                const cTerritoryTransportation = order[value]
                .map(({
                    customHouseFeeId, 
                    firstCode, 
                    lastCode
                }) => ({
                    customHouseFeeId: customHouseFeeId.toString(), 
                    firstCode, 
                    lastCode
                }));

                if (JSON.stringify(territoryTransportation) !== JSON.stringify(cTerritoryTransportation)) 
                    properties.push(value);

            } else if (value === 'actualTotalPrice') {
                const cActualTotalPrice = order[value];

                if (actualTotalPrice !== cActualTotalPrice) 
                    properties.push(value);

            } else {
                properties.push(value);
            }
        };
    });

    return properties.filter((value, index, items) => items.indexOf(value) === index);
};

exports.countriesToObj = (countries, order) => {
    const { territoryTransportation } = order;
    
    const countriesToObj = countries.reduce((pv, cv) => {
        const customHouseFee = territoryTransportation.find(({customHouseFeeId}) => customHouseFeeId.countryId._id.toString() === cv._id.toString());
        const cvo = {[cv.name]: customHouseFee ? customHouseFee.customHouseFeeId.price : 0};
        return { ...pv, ...cvo };
    }, {});

    return countriesToObj;
};

exports.toAlpha = (num) => {
    if(num < 1 || typeof num !== 'number')
        return -1;

    const leveller = 64;
    const charCode = num > 26 ? num - 26 + leveller : num + leveller;

    return String.fromCharCode(charCode);
};

exports.cell = (col, row) => {
    let coefficientAlpha = '';

    if (col > 26 && col < 52)
        coefficientAlpha = 'A';

   return `${coefficientAlpha}${this.toAlpha(col)}2:${coefficientAlpha}${this.toAlpha(col)}${row + 1}`;
};