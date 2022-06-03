const { Router } = require('express');
const { validationResult } = require('express-validator');
const { customerValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, errMsg404, msg201, msgDeleted200, msgEdited200 } = require('../utils/variables');
const Customer = require('../models/customer');

const router = Router();

/**
 * @swagger
 * /api/customer/:
 *  get:
 *   summary: Получить список клиентов
 *   tags: [Customer]
 *   parameters:
 *    - in: query
 *      name: pagination
 *      schema:
 *         type: object
 *         required:
 *            - skip
 *            - limit
 *         properties:
 *             skip:
 *                 type: number
 *             limit:
 *                 type: number
 *              
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/', async (req, res) => {
    try {
        console.log(req.query);
        const { skip, limit } = req.query;
        const customers = await Customer.find({isDeleted: false}).skip(skip || 0).limit(limit || 0).select('name phone');
        const customersMaxLength = await Customer.countDocuments({isDeleted: false});
        res.status(200).json({ customers, customersMaxLength });
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customer/{customerId}:
 *  get:
 *   summary: Получить клиента
 *   tags: [Customer]
 *   parameters:
 *    - in: path
 *      name: customerId
 *      schema:
 *         type: string
 *      description: Ввести ID плательщика
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findOne({_id: customerId, isDeleted: false}).select('name phone');
        res.status(200).json(customer);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customer/{customerId}:
 *  put:
 *   summary: Изменить данные плательщика
 *   tags: [Customer]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Customer'
 *   parameters:
 *    - in: path
 *      name: customerId
 *      schema:
 *          type: string
 *      description: Ввести ID плательщика
 *      required: true
 *   responses:
 *      201:
 *       description: Успешно изменено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/:customerId', customerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { customerId } = req.params;
        const { name, phone } = req.body;

        const customer = await Customer.findOne({_id: customerId, isDeleted: false});
        if (!customer) return res.status(404).json(errMsg404);

        customer.name = name;
        customer.phone = phone;
        await customer.save();
        
        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customer:
 *  post:
 *   summary: Добавить плательщика
 *   tags: [Customer]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Customer'
 *   responses:
 *      201:
 *       description: Успешно добавлено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', customerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        await (new Customer({...req.body})).save();

        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customer/{customerId}:
 *  delete:
 *   summary: Удалить плательщика
 *   tags: [Customer]
 *   parameters:
 *    - in: path
 *      name: customerId
 *      schema:
 *          type: string
 *      description: Ввести ID плательщика
 *      required: true
 *   responses:
 *      200:
 *       description: Успешно удалено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.delete('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId);
        customer.isDeleted = true;
        await customer.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;