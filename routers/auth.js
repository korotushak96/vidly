const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../modules/user');
const validate = require('../middleware/validate');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid password or email!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password or email!");

    const token = user.generateAuthToken();
    res.send(token);
});


function validateUser(user){
    const schema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(5).required()
    }

    return Joi.validate(user, schema)
};

module.exports = router;