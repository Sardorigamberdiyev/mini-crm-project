const { Router } = require('express');
const { errMsg500, msg201, errMsg404, msgDeleted200 } = require('../utils/variables');
const CustomHouseFee = require('../models/customHouseFee');
const Carriage = require('../models/carriage');

const router = Router();

/**
 * @swagger
 * /api/customHouseFee/:
 *  get:
 *   summary: Получить список разтаможки
 *   tags: [CustomHouseFee]
 *   parameters:
 *    - in: query
 *      name: pagination
 *      schema:
 *         type: object
 *         properties:
 *             carriageId:
 *                 type: string
 *   responses:
 *      200:
 *       description: Вернется данные
 *      404:
 *       description: Нет данные по запросу
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/', async (req, res) => {
    try {
        const { carriageId } = req.query;

        if (carriageId) {
            const filter = {_id: carriageId, isDeleted: false};

            const carriage = await Carriage
            .findOne(filter)
            .select('_id');

            if (!carriage)
                return res.status(404).json(errMsg404);
        }

        const carriageFilter = carriageId ? { carriageId } : {};
        const filter = { isDeleted: false, ...carriageFilter };
        
        const customHouseFees = await CustomHouseFee
        .find(filter)
        .populate('carriageId countryId')
        .select('-__v');

        res.status(200).json(customHouseFees);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customHouseFee/{customHouseFeeId}:
 *  get:
 *   summary: Получить разтаможку по ID
 *   tags: [CustomHouseFee]
 *   parameters:
 *    - in: path
 *      name: customHouseFeeId
 *      schema:
 *         type: string
 *      description: Ввести ID разтаможки
 *      required: true        
 *   responses:
 *      200:
 *       description: Вернется данные
 *      404:
 *       description: Данный по запросу не найден
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/:customHouseFeeId', async (req, res) => {
    try {
        const { customHouseFeeId } = req.params;

        const filter = { _id: customHouseFeeId, isDeleted: false };
        const customHouseFee = await CustomHouseFee
        .findOne(filter)
        .select('-__v');

        if (!customHouseFee)
            return res.status(404).json(errMsg404);

        res.status(200).json(customHouseFee)
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customHouseFee:
 *  post:
 *   summary: Добавить растаможку
 *   tags: [CustomHouseFee]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/CustomHouseFee'
 *   responses:
 *      201:
 *       description: Успешно добавлено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', async (req, res) => {
    try {
        await (new CustomHouseFee({...req.body})).save();
        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customHouseFee/{customHouseFeeId}:
 *  put:
 *   summary: Изменить разтаможку по ID
 *   tags: [CustomHouseFee]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/CustomHouseFee'
 *   parameters:
 *    - in: path
 *      name: customHouseFeeId
 *      schema:
 *         type: string
 *      description: Ввести ID разтаможки
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      404:
 *       description: По запросу нет данные
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/:customHouseFeeId', async (req, res) => {
    try {
        const { customHouseFeeId } = req.params;
        const filter = { _id: customHouseFeeId, isDeleted: false };
        const customHouseFee = await CustomHouseFee
        .findOne(filter)
        .select('-__v');

        if (!customHouseFee)
            return res.status(404).json(errMsg404);

        await CustomHouseFee.findByIdAndUpdate(customHouseFeeId, {...req.body})
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/customHouseFee/{customHouseFeeId}:
 *  delete:
 *   summary: Удалить разтаможку по ID
 *   tags: [CustomHouseFee]
 *   parameters:
 *    - in: path
 *      name: customHouseFeeId
 *      schema:
 *         type: string
 *      description: Ввести ID разтаможку
 *      required: true   
 *   responses:
 *      200:
 *       description: Успешно добавлено
 *      500:
 *       description: Что-то пошло не так
 */
router.delete('/:customHouseFeeId', async (req, res) => {
    try {
        const { customHouseFeeId } = req.params;
        const filter = {_id: customHouseFeeId, isDeleted: false};

        const customHouseFee = await CustomHouseFee
        .findOne(filter)
        .select('-__v');

        if (!customHouseFee)
            return res.status(404).json(errMsg404);

        customHouseFee.isDeleted = true;
        await customHouseFee.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500)
    }
});

module.exports = router;