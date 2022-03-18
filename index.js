const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const isAuthMiddleware = require('./middlewares/isAuth');
const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/token');

const app = express();
const PORT = config.get('port') || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api/token', tokenRoutes)

app.get('/api/system', isAuthMiddleware, (req, res) => {
    console.log(req.user);
    res.status(200).json('Hello')
});

start();
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'));
        app.listen(PORT, () => console.log(`Server on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}