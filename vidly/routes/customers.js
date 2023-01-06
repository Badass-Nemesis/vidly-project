const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('Joi');

router.use(express.json());

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 12,
    },
});

const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(10).max(12).required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (customer == null) {
        return res.status(404).send('The customer with this ID was not found');
    }

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error != null) {
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    if (!customer) {
        return res.status(404).send('The customer with this ID was not found');
    }

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (customer == null) {
        return res.send(404).send('The customer with this ID was not found');
    }

    res.send(customer);
});

module.exports = router;