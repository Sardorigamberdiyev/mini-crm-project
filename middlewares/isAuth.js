const jwt = require('jsonwebtoken');
const config = require('config');
const { deleteTokenAndClearCookies } = require('../utils/func-helpers');
const { errMsg403 } = require('../utils/variables');

module.exports = (req, res, next) => {
    const { access_token, refresh_token } = req.cookies;

    if (!access_token) return deleteTokenAndClearCookies(res, refresh_token, 401);
    
    jwt.verify(access_token, config.get('accessJwtSecretKey'), (err, decoded) => {
        if (err) return res.status(403).json(errMsg403);
        const { userId, role } = decoded;
        req.user = { userId, role };
        res.cookie('logged_in', 'yes');
        next();
    })
}