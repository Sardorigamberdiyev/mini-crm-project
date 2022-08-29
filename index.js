const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const isAuthMiddleware = require('./middlewares/isAuth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');
const customerRoutes = require('./routes/customer');
const carriageRoutes = require('./routes/carriage');
const stateRoutes = require('./routes/country');
const orderRoutes = require('./routes/order');
const overheadRoutes = require('./routes/overhead');
const customHouseFeeRoutes = require('./routes/customHouseFee');

const app = express();
const PORT = config.get('port') || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'crm Api',
            description: 'mini crm api information',
            servers: ['http://localhost:5000']
        },
    },
    apis: ['index.js', './routes/*.js']
}

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *        type: object
 *        properties:
 *          firstName:
 *              type: string
 *              description: Имя пользователя
 *          lastName:
 *              type: string
 *              description: Фамилия пользователя
 *          login:
 *              type: string
 *              description: Логин пользователя
 *          password:
 *              type: string
 *              description: Пароль пользователя
 *          role:
 *              type: string
 *              description: Роль пользователя
 *        required:
 *            - firstName
 *            - lastName
 *            - login
 *            - password
 *            - role
 *        example:
 *            firstName: Сардор
 *            lastName: Игамбердиев
 *            login: sardor123
 *            password: q1234567
 *            confirm: q1234567
 *            role: admin
 *      Country:
 *        type: object
 *        properties:
 *          name:
 *              type: string
 *              description: Название государство
 *        required:
 *            - name
 *        example:
 *            name: Узб
 *      Customer:
 *        type: object
 *        properties:
 *          name:
 *              type: string
 *          phone:
 *              type: string
 *        required:
 *          - name
 *          - phone
 *        example:
 *            name: Сардор Игамбердиев
 *            phone: +998(90)174-34-14 
 *      Carriage:
 *        type: object
 *        properties: 
 *          typeCarriage:
 *              type: string
 *          stateId:
 *              type: string
 *        required:
 *          - typeCarriage
 *          - stateId
 *        example:
 *            typeCarriage: спс
 *            stateId: id
 *      CustomHouseFee:
 *        type: object
 *        properties:
 *          carriageId:
 *              type: string
 *              description: Id вагона
 *          countryId:
 *              type: string
 *              description: id страны
 *          price:
 *              type: number
 *              description: цена прохода с разтаможки
 *        required:
 *          - carriageId
 *          - countryId
 *          - price
 *        example:
 *            carriageId: id
 *            countryId: id
 *            price: 100000 
 *      Order:
 *        type: object
 *        properties:
 *          firm:
 *              type: string
 *              description: Название фирмы
 *          dateIssue:
 *              type: string
 *              description: Дата выдачи
 *          senderStation:
 *              type: string
 *              description: Станция отправителя
 *          arrivalStation:
 *              type: string
 *              description: Станция прибытия
 *          customerId:
 *              type: string
 *              description: ID Плательщика
 *          sender:
 *              type: string
 *              description: Отправитель
 *          recipient:
 *              type: string
 *              description: Получатель
 *          cargoType:
 *              type: string
 *              description: Тип груза
 *          carriageId:
 *              type: string
 *              description: ID вагона
 *          carriageCount:
 *              type: number
 *              description: Количество вагонов
 *          capacity:
 *              type: number
 *              description: Обем
 *          territoryTransportation:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      customHouseFeeId:
 *                          type: string
 *                          description: ID разтаможки
 *                      firstCode:
 *                          type: number
 *                          description: Начальный код государство
 *                      lastCode:
 *                          type: number
 *                          description: Конечный код государство
 *          generalRate:
 *              type: number
 *              description: Общая ставка
 *          additionalFee:
 *              type: number
 *              description: Дополнительный сбор
 *          pricePerTon:
 *              type: number
 *              description: Цена за тонну
 *          tlg:
 *              type: object
 *              properties:
 *                  uzsPrice:
 *                      type: number
 *                      description: Узб сумм
 *                  usdPrice:
 *                      type: number
 *                      description: Конвертированный валюта на доллар
 *          
 *        required:
 *          - firm
 *          - dateIssue
 *          - senderStation
 *          - arrivalStation
 *          - customerId
 *          - sender
 *          - recipient
 *          - cargoType
 *          - carriageId
 *          - carriageCount
 *          - capacity
 *          - territoryTransportation
 *          - territorialTotalCost
 *          - additionalFee
 *          - pricePerTon
 *          - tlg
 *      Overhead:
 *          type: object
 *          properties:
 *              orderId:
 *                  type: string
 *                  description: ID заказа
 *              stateId:
 *                  type: string
 *                  description: ID государств
 *              items:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          sending:
 *                              type: object
 *                              properties:
 *                                  numberOne:
 *                                      type: number
 *                                      description: Нумерация один
 *                                  numberTwo:
 *                                      type: number
 *                                      description: Нумерация два
 *                          carriage:
 *                              type: string
 *                              description: Вагон
 *                          weight:
 *                              type: object
 *                              properties:
 *                                  value:
 *                                      type: number
 *                                      description: Значение массы
 *                                  units:
 *                                      type: string
 *                                      description: Единица измерение
 *                          payment:
 *                              type: number
 *                              description: Оплата
 */

const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.json());
app.use(cookieParser());
if (isProduction) app.use(csrf({ cookie: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/user', isAuthMiddleware, userRoutes);
app.use('/api/customer', isAuthMiddleware, customerRoutes);
app.use('/api/carriage', isAuthMiddleware, carriageRoutes);
app.use('/api/country', isAuthMiddleware, stateRoutes);
app.use('/api/order', isAuthMiddleware, orderRoutes);
app.use('/api/overhead', isAuthMiddleware, overheadRoutes);
app.use('/api/customHouseFee', isAuthMiddleware, customHouseFeeRoutes);

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