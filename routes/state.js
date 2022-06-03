const { Router } = require('express');
const { validationResult } = require('express-validator');
const { stateValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200, msgEdited200, errMsg404 } = require('../utils/variables');
const State = require('../models/state');
const Carriage = require('../models/carriage');

const router = Router();

/**
 * @swagger
 * /api/state/:
 *  get:
 *   summary: Получить список государств
 *   tags: [State]
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
        const { skip, limit } = req.query;

        const states = await State.find({isDeleted: false}).skip(skip || 0).limit(limit || 0);
        const statesMaxLength = await State.countDocuments({isDeleted: false});

        res.status(200).json({ states, statesMaxLength })
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/state/{stateId}:
 *  get:
 *   summary: Получить государств по id
 *   tags: [State]
 *   parameters:
 *    - in: path
 *      name: stateId
 *      schema:
 *         type: string
 *      description: Ввести ID государств
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/:stateId', async (req, res) => {
    try {
        const { stateId } = req.params;

        const state = await State.findOne({_id: stateId, isDeleted: false});

        res.status(200).json(state);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/state/{stateId}:
 *  put:
 *   summary: Изменить данные государство
 *   tags: [State]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/State'
 *   parameters:
 *    - in: path
 *      name: stateId
 *      required: true
 *      schema:
 *          type: string
 *      description: Ввести ID государств
 *   responses:
 *      200:
 *       description: Успешно изменено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.put('/:stateId', stateValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { stateId } = req.params;
        const { name, cost } = req.body;

        const state = await State.findOne({_id: stateId, isDeleted: false});
        if (!state) return res.status(404).json(errMsg404);

        state.name = name;
        state.cost = cost;
        await state.save();

        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/state:
 *  post:
 *   summary: Добавить государство
 *   tags: [State]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/State'
 *   responses:
 *      201:
 *       description: Успешно добавлено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', stateValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json(validatorJsonData(errors));

        // const { carriageId, name } = req.body;

        // const carriage = await Carriage.findOne({_id: carriageId, isDeleted: false});
        // if (!carriage)
        //     return res.status(404).json(errMsg404);

        await (new State({...req.body})).save();

        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/state/{stateId}:
 *  delete:
 *   summary: Удалить государств
 *   tags: [State]
 *   parameters:
 *      - in: path
 *        name: stateId
 *        schema:
 *          type: string
 *        required: true
 *        description: Ввести ID государств
 *   responses:
 *      200:
 *       description: Успешно удалено
 *      500:
 *       description: Что-то пошло не так
 */
router.delete('/:stateId', async (req, res) => {
    try {
        const { stateId } = req.params;

        const state = await State.findById(stateId);
        state.isDeleted = true;
        await state.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;