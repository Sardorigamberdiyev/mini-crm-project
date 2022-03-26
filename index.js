const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const isAuthMiddleware = require('./middlewares/isAuth');
const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/token');

const app = express();
const PORT = config.get('port') || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.use('/api', authRoutes);
app.use('/api/token', tokenRoutes)

app.get('/api/system', isAuthMiddleware, (req, res, next) => {
    res.status(200).json(req.user)
})

if (isProduction) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

start();
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'));
        app.listen(PORT, () => console.log(`Server on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}