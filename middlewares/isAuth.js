const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const cookies = req.cookies;
    if (!token) return res.status(401).json({ errMsg: 'Нет авторизации' });

    jwt.verify(token, config.get('accessJwtSecretKey', (err, decoded) => {
        if (err) return res.status(403).json({ errMsg: 'Вам нет доступа' });
        req.user = decoded._id;
        next();
    }))
}