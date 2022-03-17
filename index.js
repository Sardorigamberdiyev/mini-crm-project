const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const app = express();

const PORT = config.get('port') || 5000;

app.use(express.json());

start();

async function start() {
    try {
        await mongoose.connect(config('mongoUri'));
        app.listen(PORT, () => console.log(`Server on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}