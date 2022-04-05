const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const isAuthMiddleware = require('./middlewares/isAuth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const customerRoutes = require('./routes/customer');
const carriageRoutes = require('./routes/carriage');
const stateRoutes = require('./routes/state');

const app = express();
const PORT = config.get('port') || 5000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cookieParser());
if (isProduction) app.use(csrf({ cookie: true }));

app.use('/api/auth', authRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/user', isAuthMiddleware, userRoutes);
app.use('/api/customer', isAuthMiddleware, customerRoutes);
app.use('/api/carriage', isAuthMiddleware, carriageRoutes);
app.use('/api/state', isAuthMiddleware, stateRoutes);

if (isProduction) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.use((req, res) => {
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