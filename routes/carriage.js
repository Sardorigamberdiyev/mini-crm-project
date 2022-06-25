const { Router } = require('express');
const { validationResult } = require('express-validator');
const { carriageValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200, msgEdited200 } = require('../utils/variables');
const Carriage = require('../models/carriage');

const router = Router();

/**
 * @swagger
 * /api/carriage/:
 *  get:
 *   summary: Получить список вагонов
 *   tags: [Carriage]
 *   parameters:
 *    - in: query
 *      name: pagination
 *      schema:
 *         type: object
 *         properties:
 *             skip:
 *                 type: number
 *             limit:
 *                 type: number
 *         required:
 *            - skip
 *            - limit
 *              
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/', async (req, res) => {
    try {
        const { skip, limit } = req.query;

        const carriages = await Carriage.find({isDeleted: false}).skip(skip || 0).limit(limit || 0).select('typeCarriage');
        const carriagesMaxLength = await Carriage.countDocuments({isDeleted: false});
        
        res.status(200).json({ carriages, carriagesMaxLength });
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/carriage/{carriageId}:
 *  get:
 *   summary: Получить вагон по ID
 *   tags: [Carriage]
 *   parameters:
 *    - in: path
 *      name: carriageId
 *      schema:
 *         type: string
 *      description: Ввести ID вагона
 *      required: true        
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/:carriageId', async (req, res) => {
    try {
        const { carriageId } = req.params;
        const carriage = await Carriage.findOne({_id: carriageId, isDeleted: false}).select('typeCarriage');

        res.status(200).json(carriage);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/carriage/{carriageId}:
 *  put:
 *   summary: Изменить вагон по ID
 *   tags: [Carriage]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Carriage'
 *   parameters:
 *    - in: path
 *      name: carriageId
 *      schema:
 *         type: string
 *      description: Ввести ID вагона
 *      required: true        
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/:carriageId', carriageValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { carriageId } = req.params;
        const { typeCarriage } = req.body;

        const carriage = await Carriage.findOne({_id: carriageId, isDeleted: false});
        carriage.typeCarriage = typeCarriage;
        await carriage.save();

        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/carriage:
 *  post:
 *   summary: Добавить вагон
 *   tags: [Carriage]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Carriage'
 *   responses:
 *      201:
 *       description: Успешно добавлено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', carriageValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        await (new Carriage({...req.body})).save();

        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/carriage/{carriageId}:
 *  delete:
 *   summary: Удалить вагон по ID
 *   tags: [Carriage]
 *   parameters:
 *    - in: path
 *      name: carriageId
 *      schema:
 *         type: string
 *      description: Ввести ID вагона
 *      required: true   
 *   responses:
 *      200:
 *       description: Успешно добавлено
 *      500:
 *       description: Что-то пошло не так
 */
router.delete('/:carriageId', async (req, res) => {
    try {
        const { carriageId } = req.params;

        const carriage = await Carriage.findById(carriageId);
        carriage.isDeleted = true;
        await carriage.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;