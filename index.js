const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes = require('./routes/auth');

const PORT = config.get('port') || 5000;

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(req.cookies);
    next();
});
app.use('/api', authRoutes);

start();
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'));
        app.listen(PORT, () => console.log(`Server on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}