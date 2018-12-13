const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../modules/customer')


router.get('/', async(req, res)=> {
    const customers = await Customer.find();
    res.send(customers);
});

router.post('/', async(req,res)=>{
    const{error} = validate(req.body);
    if (error) res.status(400).send(error.details[0].message)
    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    customer = await customer.save();
    res.send(customer);
});

router.get('/:id', async(req,res)=>{
    const customer = await Customer.findById(req.params.id);
    if (!customer) res.status(404).send('not found customer');
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndUpdate({_id: req.params.id}, {$set: {
                name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone}
    }, {new: true})
    if (!customer) return res.status(404).send(`this customer's page was not found`);

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    let customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) res.status(404).send(`this customer's page was not found`);
    res.send(customer);
})



module.exports = router;