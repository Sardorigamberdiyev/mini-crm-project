const { Router } = require('express');
const { isObjectIdOrHexString } = require('mongoose')

const { errMsg500, errMsg404, msgEdited200, msg201 } = require('../utils/variables');
const Order = require('../models/order');
const Overhead = require('../models/overhead');
const router = Router();


/**
 * @swagger
 * /api/overhead/order:
 *  get:
 *   summary: Получить накладной
 *   tags: [Overhead]
 *   parameters:
 *    - in: query
 *      name: overhead
 *      schema:
 *         type: object
 *         properties:
 *              orderId:
 *                  type: string
 *                  description: ID заказа
 *              countryId:
 *                  type: string
 *                  description: ID государство
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
 router.get('/order', async (req, res) => {
    try {
        const { orderId, countryId } = req.query;
        
        if (!(isObjectIdOrHexString(orderId) || isObjectIdOrHexString(countryId)))
            return res.status(404).json(errMsg404);

        const overhead = await Overhead.findOne({orderId, countryId}).select('-__v');

        res.status(200).json(overhead);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/overhead/{overheadId}:
 *  get:
 *   summary: Получить накладной по id
 *   tags: [Overhead]
 *   parameters:
 *    - in: path
 *      name: overheadId
 *      schema:
 *         type: string
 *      description: Ввести ID накладного
 *      required: true
 *   responses:
 *      200:
 *       description: Вернется данные
 *      500:
 *       description: Что-то пошло не так
 */
router.get('/:overheadId', async (req, res) => {
    try {
        const { overheadId } = req.params;
        const overhead = await Overhead.findById(overheadId)
                                       .populate('orderId countryId', '-__v')
                                       .select('-__v');
        
        res.status(200).json(overhead);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

/**
 * @swagger
 * /api/overhead:
 *  post:
 *   summary: Добавление накладной
 *   tags: [Overhead]
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Overhead'
 *   responses:
 *      201:
 *       description: Успешно добавлено
 *      400:
 *       description: Плохой запрос от клиента
 *      404:
 *       description: Нет данный по запросу
 *      500:
 *       description: Что-то пошло не так
 */
router.post('/', async (req, res) => {
    try {
        const { orderId, countryId } = req.body;

        const orderFilter = {
            _id: orderId,
            territoryTransportation: { $elemMatch: { countryId }},
            isDelete: false
        };
        const overheadFilter = {orderId, countryId};

        const order = await Order.findOne(orderFilter);
        const overhead = await Overhead.findOne(overheadFilter);

        if (!order) 
            return res.status(404).json(errMsg404);

        if (!overhead) {
            const newOverhead = new Overhead({...req.body});
            await newOverhead.save();
        } else
            await Overhead.findOneAndUpdate(overheadFilter, {...req.body});
        
        res.status(200).json(!overhead ? msg201 : msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;