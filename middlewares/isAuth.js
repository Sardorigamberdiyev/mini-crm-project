const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const authorization = req.headers.authorization || null;
    const token = authorization ? authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ errMsg: 'Нет авторизации' });

    jwt.verify(token, config.get('accessJwtSecretKey', (err, decoded) => {
        if (err) return res.status(403).json({ errMsg: 'Вам нет доступа' });
        req.user = decoded._id;
        next();
    }))
}