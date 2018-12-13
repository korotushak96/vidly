const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {type: String, required: true},
    isGold: {type: Boolean, default: false},
    phone: {type: Number, required: true}
    })
)

function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.number().required()
    };
    
    return Joi.validate(customer, schema);
};

exports.Customer = Customer;
exports.validate = validateCustomer;