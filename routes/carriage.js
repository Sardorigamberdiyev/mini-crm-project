const { Router } = require('express');
const { validationResult } = require('express-validator');
const { carriageValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200, msgEdited200 } = require('../utils/variables');
const Carriage = require('../models/carriage');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { skip, limit } = req.query;

        const carriages = await Carriage.find({isDeleted: false}).skip(skip || 0).limit(limit || 0);
        const carriagesMaxQuantity = await Carriage.countDocuments({isDeleted: false});

        res.status(200).json({ carriages, carriagesMaxQuantity });
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.get('/:carriageId', async (req, res) => {
    try {
        const { carriageId } = req.params;

        const carriage = await Carriage.findOne({_id: carriageId, isDeleted: false});

        res.status(200).json(carriage);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

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