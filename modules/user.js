const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        min: 5,
        max: 50
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    isAdmin: {
        type: Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id : this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);


function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(5).required()
    };
    
    return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;