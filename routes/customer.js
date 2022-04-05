const { Router } = require('express');
const { validationResult } = require('express-validator');
const { customerValidator } = require('../utils/validator');
const { validatorJsonData } = require('../utils/func-helpers');
const { errMsg500, msg201, msgDeleted200, msgEdited200 } = require('../utils/variables');
const Customer = require('../models/customer');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const customers = await Customer.find({isDeleted: false}).skip(skip || 0).limit(limit || 0);
        const customersMaxQuantity = await Customer.countDocuments({isDeleted: false});
        res.status(200).json({ customers, customersMaxQuantity });
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.get('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findOne({_id: customerId, isDeleted: false});
        res.status(200).json(customer);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

router.put('/:customerId', customerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(validatorJsonData(errors));

        const { customerId } = req.params;
        const { name, phone } = req.body;

        const customer = await Customer.findOne({_id: customerId, isDeleted: false});
        customer.name = name;
        customer.phone = phone;
        await customer.save();
        
        res.status(200).json(msgEdited200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

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

router.delete('/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = Customer.findById(customerId);
        customer.isDeleted = true;
        await customer.save();

        res.status(200).json(msgDeleted200);
    } catch (e) {
        res.status(500).json(errMsg500);
    }
});

module.exports = router;