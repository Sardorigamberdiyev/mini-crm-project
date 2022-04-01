const { Router } = require('express');
const { validationResult } = require('express-validator');
const { stateValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200, msg200, msgEdited200 } = require('../utils/variables');
const State = require('../models/state');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { skip, limit } = req.query;

        const states = await State.find({isDeleted: false}).skip(skip || 0).limit(limit || 0);
        const statesMaxQuantity = await State.countDocuments();

        res.status(200).json({ states, statesMaxQuantity })
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.get('/:stateId', async (req, res) => {
    try {
        const { stateId } = req.params;

        const state = await State.findOne({_id: stateId, isDeleted: false});

        res.status(msg200).json(state);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.put('/:stateId', stateValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { stateId } = req.params;
        const { name, currency, cost } = req.body;

        const state = await State.findOne({_id: stateId, isDeleted: false});
        state.name = name;
        state.currency = currency;
        state.cost = cost;
        await state.save();

        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.post('/', stateValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.array()) return res.status(400).json(validatorJsonData(errors));

        const state = new State({...req.body});
        await state.save();

        res.status(201).json(msg201);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

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