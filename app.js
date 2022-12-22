require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
const models = require('./models/index');
const cors = require('cors');
const router = require('./routes/user.router');
const errorHandler = require('./error/errorHandler');
const {PORT} = require('./configs/config');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();