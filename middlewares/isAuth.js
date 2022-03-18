const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        res.cookie('logged_in', 'no');
        return res.status(401).json({ errMsg: 'Нет авторизации' });
    }
    
    jwt.verify(access_token, config.get('accessJwtSecretKey'), (err, { userId }) => {
        if (err) {
            res.cookie('logged_in', 'no');
            return res.status(403).json({ errMsg: 'Вам нет доступа' });
        }

        req.user = { userId };
        res.cookie('logged_in', 'yes');
        next();
    })
}