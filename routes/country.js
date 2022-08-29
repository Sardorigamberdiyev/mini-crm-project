const { Router } = require('express');
const { validationResult } = require('express-validator');
const { countryValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200, msgEdited200, errMsg404 } = require('../utils/variables');
const Country = require('../models/country');

const router = Router();

/**
 * @swagger
 * /api/country/:
 *  get:
 *   summary: Получить список государств
 *   tags: [Country]
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
        const filter = {isDeleted: false};
        const countries = await Country
        .find(filter)
        .skip(skip || 0)
        .limit(limit || 0);
        const countriesMaxLength = await Country.countDocuments(filter);

        res.status(200).json({ countries, countriesMaxLength })
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/country/{countryId}:
 *  get:
 *   summary: Получить государств по id
 *   tags: [Country]
 *   parameters:
 *    - in: path
 *      name: countryId
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
router.get('/:countryId', async (req, res) => {
    try {
        const { countryId } = req.params;
        const filter = {_id: countryId, isDeleted: false};
        const country = await Country.findOne(filter);

        if (!country)
            return res.status(404).json(errMsg404);

        res.status(200).json(country);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/country/{countryId}:
 *  put:
 *   summary: Изменить данные государство
 *   tags: [Country]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Country'
 *   parameters:
 *    - in: path
 *      name: countryId
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
router.put('/:countryId', countryValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json(validatorJsonData(errors));

        const { countryId } = req.params;
        const { name } = req.body;

        const filter = {_id: countryId, isDeleted: false};
        const country = await Country.findOne(filter);
        if (!country) 
            return res.status(404).json(errMsg404);

        country.name = name;
        await country.save();

        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/country:
 *  post:
 *   summary: Добавить государство
 *   tags: [Country]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Country'
 *   responses:
 *      201:
 *       description: Успешно добавлено
 *      400:
 *       description: Плохой запрос от клиента
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', countryValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json(validatorJsonData(errors));

        await (new Country({...req.body})).save();

        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/country/{countryId}:
 *  delete:
 *   summary: Удалить государств
 *   tags: [Country]
 *   parameters:
 *      - in: path
 *        name: countryId
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
router.delete('/:countryId', async (req, res) => {
    try {
        const { countryId } = req.params;

        const country = await Country.findById(countryId);
        country.isDeleted = true;
        await country.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;