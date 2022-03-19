const Token = require('../models/token');
const { errMsg401, msgLogout200 } = require('../utils/variables');

exports.validatorJsonData = (errors) => ({errors: errors.array(), errMsg: 'Вы не прошли валидацию'});

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
}