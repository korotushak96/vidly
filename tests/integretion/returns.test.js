const {Rental} = require('../../modules/rental');
const {User} = require('../../modules/user');
const {Movie} = require('../../modules/movie');
const request = require('supertest');
const moment = require('moment');
const mongoose = require('mongoose');

describe('/api/returns', () =>{
    let rental;
    let customerId;
    let movieId;
    let token;
    let movie;

    const exec = ()=>{
       return  request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    };

    beforeEach(async()=>{
        server = require('../../script');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: {name: '12345'},
            dailyRentalRate: 2,
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer : {
                _id : customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });

    afterEach(async()=>{
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async ()=>{
        customerId = '';
        res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async ()=>{
        movieId = '';
        res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found', async ()=>{
        await Rental.remove({});
        res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async ()=>{
        rental.dateReturned = new Date();
        await rental.save();
        res = await exec();
        expect(res.status).toBe(400);
    });

    it('return 200 if request is valid', async()=>{
        res = await exec();
        expect(res.status).toBe(200);
    })

    it('should set returned Date', async ()=>{
        res = await exec();

        rentalInDB = await Rental.findById(rental._id);
        const dif = new Date() - rentalInDB.dateReturned;
        expect(dif).toBeLessThan(10*1000);
    });

    it('should calculate rental fee', async()=>{
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        res = await exec();
        rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(14);
    });

    it('should increase the stock', async()=>{
        res = await exec();
        movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(11);
    });

    it('should return the rental', async()=>{
        res = await exec();
        const rentalInDB = await Rental.findById(rental._id)
        expect(res.body).toBeDefined();
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'customer', 'movie', 'rentalFee', 'dateReturned']));
    });
})