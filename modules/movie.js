const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre')

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min:0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min:0
    },
}))


function validateMovie(movie){
    const schema = {
        title: Joi.string().min(3).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    };
    
    return Joi.validate(movie, schema);
};

exports.Movie = Movie;
exports.validate = validateMovie;