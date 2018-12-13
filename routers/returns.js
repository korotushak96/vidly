const express = require('express');
const router = express.Router();
const Joi = require('joi');
  Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middleware/auth');
const validate = require('../middleware/validate.js');
const {Rental} = require('../modules/rental');
const {Movie} = require ('../modules/movie');



router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const token = req.header('x-auth-token');
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if(!rental) return res.status(404).send('no rental found');    
    if(rental.dateReturned) return res.status(400).send('Rental already processed');
    
    
    rental.return();
    await rental.save();
    
    await Movie.update({_id: rental.movie._id}, 
        {$inc: {numberInStock: 1}});
    
    res.send(rental);
    
});

function validateReturn(req){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(req, schema);
}
module.exports = router;

