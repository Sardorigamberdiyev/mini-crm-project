const { Router } = require('express');
const path = require('path');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const { validationResult } = require('express-validator');
const { orderValidator } = require('../utils/validator');
const { 
    errMsg500, 
    msgDeleted200, 
    msg201, 
    errMsg404, 
    errMsgCarriageReturn400, 
    errMsgCarriageCount400, 
    msgEdited200 
} = require('../utils/variables');
const { 
    orderChangedProperties, 
    toAlpha, 
    cell, 
    rowOrderItem,
    validatorJsonData
} = require('../utils/func-helpers');
const todayDate = require('../utils/today-date');
const Order = require('../models/order');
const Customer = require('../models/customer');
const State = require('../models/state');
const Carriage = require('../models/carriage');
const router = Router();

/**
 * @swagger
 * /api/order/:
 *  get:
 *   summary: Получить список заказов
 *   tags: [Order]
 *   parameters:
 *    - in: query
 *      name: filer query
 *      schema:
 *         type: object
 *         properties:
 *             skip:
 *                 type: number
 *             limit:
 *                 type: number
 *             debt:
 *                 type: string
 *             startDate:
 *                 type: string
 *             endDate:
 *                 type: string
 *             term:
 *                 type: string
 *         required:
 *           - skip
 *           - limit
 *         example:
 *             skip: 0
 *             limit: 10
 *             debt: yes
 *             startDate: 2022-05-12T19:00
 *             endDate: 2022-05-12T19:00
 *             term: плательщик
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/', async (req, res) => {
    try {
        console.log(req.query);
        const { skip, limit, term, debt, startDate, endDate } = req.query;

        const customerIds = ((term && await Customer.find({name: {$regex: `^${term}`}})
                                                    .select('_id')) || [])
                                                    .map(c => c._id);

        const customerByIds = term ? {customerId: {$in: customerIds}} : {};
        const orderByDate = startDate && endDate ? {date: {$gte: startDate, $lte: endDate}} : {};
        const orderByDebt = debt === 'yes' ? {debt: {$gt: 0}} : {};

        const filter = {
            isDeleted: false,
            ...orderByDate,
            ...customerByIds,
            ...orderByDebt
        }

        const orders = await Order.find(filter)
                                  .skip(skip || 0)
                                  .limit(limit || 12)
                                  .populate('carriageId customerId territoryTransportation.stateId')
                                  .sort({date: -1})
                                  .select('-__v');

        const ordersMaxLength = await Order.countDocuments(filter);

        res.status(200).json({ orders, ordersMaxLength });
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/statistics:
 *  get:
 *   summary: Получить статистику заказов
 *   tags: [Order]
 *   parameters:
 *    - in: query
 *      name: statistics filter query
 *      schema:
 *         type: object
 *         properties:
 *             startDate:
 *                 type: string
 *             endDate:
 *                 type: string
 *   responses:
 *      200:
 *       description: Вернется статистику заказа
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/statistics', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // const orderStatistics = await Order.aggregate([])
        res.status(200).json({startDate, endDate})
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/xlsx:
 *  get:
 *   summary: Получить путь к экзелу
 *   tags: [Order]
 *   parameters:
 *    - in: query
 *      name: xlsx filter query
 *      schema:
 *         type: object
 *         properties:
 *             startDate:
 *                 type: string
 *             endDate:
 *                 type: string
 *   responses:
 *      200:
 *       description: Вернет путь xlsx
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/xlsx', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const filterByDate = startDate && endDate ? {date: {$gte: startDate, $lte: endDate}} : {};
        const filter = {isDeleted: false, ...filterByDate};

        const orders = await Order.find(filter)
                                  .populate('carriageId territoryTransportation.stateId', 'typeCarriage name cost')
                                  .select('-__v -userId -date -changedProperties');
        const oLength = await Order.countDocuments(filter);
        const states = await State.find({isDeleted: false}).select('name cost');

        const keysStates = Object.keys(states);
        const keysLength = keysStates.length;

        let formulaTotalCost = '';
        keysStates.forEach((value, index) => {
            const num = 10 + index + 1;
            formulaTotalCost += `${cell(num, oLength)}${keysLength > index + 1 ? '+' : ''}`;
        });

        const xlsxData = orders.map((order) => rowOrderItem(order, states));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(xlsxData);

        const lastStateColl = 10 + keysLength;
        const aFeeColl = lastStateColl + 2;
        const tTotalRateColl = lastStateColl + 1;
        const pricePerTonColl = lastStateColl + 3;
        const tlgUzsColl = lastStateColl + 4;
        const tlgUsdColl = lastStateColl + 5;
        const totalPriceColl = lastStateColl + 6;
        const aCarriageCountColl = lastStateColl + 7;
        const aCapacityColl = lastStateColl + 8;
        const aPricePerTonColl = lastStateColl + 9;
        const aTotalPriceColl = lastStateColl + 10;
        const doingCostColl = lastStateColl + 11;
        const debtColl = lastStateColl + 12;
        const capacityColl = 10;
        const carriageCountColl = 8;
        const carriageReturnColl = 9;

        // Формула для Обшая ставка
        XLSX.utils.sheet_set_array_formula(
            ws, 
            cell(tTotalRateColl, oLength), 
            `${formulaTotalCost}`
        );

        // Формула для Цена за тонну
        XLSX.utils.sheet_set_array_formula(
            ws, 
            cell(pricePerTonColl, oLength), 
            `(${cell(aFeeColl, oLength)}/(${cell(capacityColl, oLength)}/${cell(aCarriageCountColl, oLength)}))+${cell(tTotalRateColl, oLength)}`
        );

        // Формула для Общая цена
        XLSX.utils.sheet_set_array_formula(
            ws,
            cell(totalPriceColl, oLength),
            `${cell(aFeeColl, oLength)}*${cell(aCarriageCountColl, oLength)}+${cell(capacityColl, oLength)}*${cell(tTotalRateColl, oLength)}`
        );

        // Формула для Кол-во вогонов по факту
        XLSX.utils.sheet_set_array_formula(
            ws,
            cell(aCarriageCountColl, oLength),
            `${cell(carriageCountColl, oLength)}-${cell(carriageReturnColl, oLength)}`
        );

        // Формула для Цена за тонну по факту
        XLSX.utils.sheet_set_array_formula(
            ws,
            cell(aPricePerTonColl, oLength),
            `(${cell(aFeeColl, oLength)}/(${cell(aCapacityColl, oLength)}/${cell(aCarriageCountColl, oLength)}))+${cell(tTotalRateColl, oLength)}`
        );

        // Формула для Обшая цена по факту
        XLSX.utils.sheet_set_array_formula(
            ws,
            cell(aTotalPriceColl, oLength),
            `${cell(aCapacityColl, oLength)}*${cell(aPricePerTonColl, oLength)}`
        );

        // Формула для Сальдо
        XLSX.utils.sheet_set_array_formula(
            ws,
            cell(debtColl, oLength),
            `${cell(doingCostColl, oLength)}-${cell(aTotalPriceColl, oLength)}`
        );

        // Объединение ячейек ТЛГ сумма uzs, usd
        const merge = XLSX.utils.decode_range(`${toAlpha(tlgUzsColl)}1:${toAlpha(tlgUsdColl)}1`);

        // Добавление объединенного ячейку
        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push(merge);

        const xlsxFileName = `${Date.now()}.xlsx`;
        const xlsxPath = path.join(__dirname, `../xlsx/${xlsxFileName}`);
        const sheetName = 'Заказы';

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, xlsxPath);

        res.download(path.join(__dirname, `../xlsx/${xlsxFileName}`));
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/{orderId}:
 *  get:
 *   summary: Получить заказ по id
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: orderId
 *      schema:
 *         type: string
 *      description: Ввести ID заказа
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.isValidObjectId(orderId))
            return res.status(404).json(errMsg404);

        const order = await Order.findOne({_id: orderId, isDeleted: false})
                                 .populate('carriageId customerId territoryTransportation.stateId', '-__v')
                                 .select('-__v');
        if (!order)
            return res.status(404).json(errMsg404);

        res.status(200).json(order);
    } catch (e) {
        console.log(e)
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order:
 *  post:
 *   summary: Отправить заказ
 *   tags: [Order]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Order'
 *   responses:
 *      201:
 *       description: Успешно оптравлено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', orderValidator, async (req, res) => {
    try {
        // Валидация
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json(validatorJsonData(errors));
        // --------------------------------------------------------
        
        console.log(req.body);
        const { userId } = req.user;
        const { carriageCount, carriageId, customerId, capacity, additionalFee, generalRate } = req.body;

        const carriageFilter = {_id: carriageId, isDeleted: false};
        const customerFilter = {_id: customerId, isDeleted: false};

        const carriage = await Carriage.findOne(carriageFilter);
        const customer = await Customer.findOne(customerFilter);

        if (!carriage || !customer)
            return res.status(404).json(errMsg404);

        const {date} = todayDate();

        const newOrder = {
            ...req.body,
            userId,
            date,
            carriageRemainder: carriageCount,
            totalPrice: (additionalFee * carriageCount) + (generalRate * capacity),
        };

        const order = new Order(newOrder);
        await order.save();
        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/{orderId}:
 *  put:
 *   summary: Изменить заказ по ID
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: orderId
 *        schema:
 *          type: string
 *        required: true
 *        description: Ввести ID заказа
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Order'
 *   responses:
 *      200:
 *       description: Успешно изменено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/:orderId', orderValidator, async (req, res) => {
    try {
        // Валидация
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json(validatorJsonData(errors));
        // --------------------------------------------------------

        const { orderId } = req.params;
        const { carriageCount, capacity, additionalFee, generalRate } = req.body;

        const filter = {_id: orderId, isDeleted: false};

        const order = await Order.findOne(filter);
        const { carriageReturn: currentCarriageReturn } = order;

        if (!order) 
            return res.status(404).json(errMsg404);

        if (currentCarriageReturn > carriageCount) 
            return res.status(400).json(errMsgCarriageCount400);

        const changedProperties = orderChangedProperties(order, req.body);

        const orderUpdate = {
            ...req.body,
            changedProperties,
            carriageCount: carriageCount + currentCarriageReturn,
            carriageRemainder: carriageCount,
            totalPrice: (additionalFee * carriageCount) + (generalRate * capacity)
        };

        await Order.findOneAndUpdate(filter, orderUpdate);

        res.status(200).json(msgEdited200);
    } catch (e) {
        console.log(e);
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/info/{orderId}:
 *  put:
 *   summary: Изменить и добавить доп.инфо заказ по ID
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: orderId
 *        schema:
 *          type: string
 *        required: true
 *        description: Ввести ID заказа
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      infoText:
 *                          type: string
 *                      infoColor:
 *                          type: string
 *   responses:
 *      200:
 *       description: Успешно изменено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/info/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { infoText, infoColor } = req.body;

        const order = await Order.findOne({_id: orderId, isDeleted: false});

        if (!order) 
            return res.status(404).json(errMsg404);

        order.additionalInfo = {infoText, infoColor};
        await order.save();
        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/wagon/return/{orderId}:
 *  put:
 *   summary: Изменить и возврат вагона заказ по ID
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: orderId
 *        schema:
 *          type: string
 *        required: true
 *        description: Ввести ID заказа
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      carriageReturn:
 *                          type: number
 *                          description: Кол-во возврат вагона
 *                  required:
 *                    - carriageReturn
 *   responses:
 *      200:
 *       description: Успешно изменено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/wagon/return/:orderId', async (req, res) => {
    try {
        console.log(req.body);
        const { orderId } = req.params;
        const { carriageReturn } = req.body;
        const filter = {_id: orderId, isDeleted: false};

        const order = await Order.findOne(filter);
        if (!order) return res.status(404).json(errMsg404);

        const {
            carriageReturn: cCarriageReturn,
            carriageRemainder: cCarriageRemainder,
            generalRate,
            capacity,
            additionalFee
        } = order;

        if (cCarriageRemainder < carriageReturn) 
            return res.status(400).json(errMsgCarriageReturn400);

        const carriageRemainder = Number(cCarriageRemainder) - Number(carriageReturn);

        order.carriageReturn = Number(cCarriageReturn) + Number(carriageReturn);
        order.carriageRemainder = carriageRemainder;
        order.totalPrice = (additionalFee * carriageRemainder) + (generalRate * capacity);
        order.pricePerTon = carriageRemainder ? (additionalFee/(capacity/carriageRemainder)) + generalRate : 0;

        await order.save();

        res.status(200).json(msgEdited200);
    } catch (e) {
        console.log(e)
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/doing/{orderId}:
 *  put:
 *   summary: Изменить значение поступая
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: orderId
 *        schema:
 *          type: string
 *        required: true
 *        description: Ввести ID заказа
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      cost:
 *                          type: number
 *                      date:
 *                          type: string
 *                  required:
 *                    - cost
 *                    - date
 *   responses:
 *      200:
 *       description: Успешно изменено
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/doing/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { cost, date } = req.body;
        const filter = {_id: orderId, isDeleted: false};

        const order = await Order.findOne(filter);
        if (!order) 
            return res.status(400).json(errMsg404);
        
        order.doing = {cost, date};
        order.debt = cost - order.totalPrice;
        await order.save();

        res.status(200).json(msgEdited200);
    } catch (e) {
        console.log(e);
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/order/{orderId}:
 *  delete:
 *   summary: Удалить заказ по id
 *   tags: [Order]
 *   parameters:
 *    - in: path
 *      name: orderId
 *      schema:
 *         type: string
 *      description: Ввести ID заказа
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.delete('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        order.isDeleted = true;
        await order.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;