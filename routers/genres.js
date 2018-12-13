const validateObjectId = require('../middleware/validateObjectId.js')
const auth = require('../middleware/auth');
const validate = require('../middleware/validate.js');
const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../modules/genre');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
     const genres = await Genre.find(); 
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => { 
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send(`this genre's page was not found`);
    res.send(genre);
});

router.post('/', [auth, validate(validateGenre)],  async (req,res)=> {
    let genre = new Genre({
        name: req.body.name
    })
    genre = await genre.save();    
    res.send(genre);
});

router.put('/:id', validate(validateGenre), async (req, res) => {
    const genre = await Genre.findByIdAndUpdate({_id: req.params.id}, {$set: {
        name:req.body.name}
    }, {new: true})
    if (!genre) return res.status(404).send(`this genre's page was not found`);

    res.send(genre);
});

router.delete('/:id',[auth, admin], async (req, res) => {
    let genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send(`this genre's page was not found`);
    res.send(genre);
});



module.exports = router;