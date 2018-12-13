const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../modules/movie');
const {Genre} = require("../modules/genre")


router.get('/', async(req, res)=> {
    const movies = await Movie.find();
    res.send(movies);
});

router.post('/', async(req,res)=>{
    const{error} = validate(req.body);
    if (error) res.status(400).send(error.details[0].message)
    let genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("couldn't find genre" );
    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();
    res.send(movie);
});

router.get('/:id', async(req,res)=>{
    const movie = await Movie.findById(req.params.id);
    if (!movie) res.status(404).send('not found movie');
    res.send(movie);
});

router.put('/:id', async (req, res) => {
    let genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("couldn't find genre" );
    const movie = await Movie.findByIdAndUpdate({_id: req.params.id}, {$set: {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate}
    }, {new: true})
    if (!movie) return res.status(404).send(`this movie's page was not found`);

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    let movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) res.status(404).send(`this movie's page was not found`);
    res.send(movie);
})



module.exports = router;