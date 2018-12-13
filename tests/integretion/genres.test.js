//my

let server;
const request = require('supertest');
const {User} = require('../../modules/user');
const {Genre} = require('../../modules/genre');
const mongoose = require('mongoose');

describe('api/genres', ()=>{
    beforeEach( async ()=>{     
        server = require('../../script');
    });

    afterEach(async ()=>{
        await Genre.remove({}); 
    })

    describe('GET /', ()=> {
        it('should return all genres', async () =>{
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'},
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    });

    describe('GET /:id', () =>{
        it('should return one genre', async ()=>{
            const genre = new Genre({name: 'genre1'});
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name)
        });

        it('should return 404 if id is invalid', async ()=>{
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });

        it('should return 404 if page not exist', async ()=>{
            const genre = new Genre({name: "genre1"});
            await genre.save();
            const id = mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });

    })

    describe('POST /', () => {
        let token;
        let name;


        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: name});
        };

        beforeEach(()=>{
            token = new User().generateAuthToken();
            name = 'genre1'
        })

        it('should return 401', async ()=> {
             token = ' ';
           
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if input is invalid', async ()=>{
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if input is invalid', async ()=>{
            name = new Array(52);

            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should return posted genre', async ()=>{
            const res = await exec();
            
            const result = Genre.find({name: 'genre1'});

            expect(result).not.toBeNull();
        });

        it('should return posted genre', async ()=>{
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', "genre1");
        })
    });

    describe("PUT/:id", ()=>{
        it ('should edit genre', async() =>{
            const genre1 = new Genre({name: "genre1"});
            await genre1.save();
            const id = genre1._id
            const res = await request(server).put(`/api/genres/${id}`).send({name: 'new genre'});
            expect(res.status).toBe(200); 
            expect(res.body).toHaveProperty("name", "new genre");
        });

        it('should return 404 if genre"s page not found', async()=>{
            const id = mongoose.Types.ObjectId().toHexString();
            const res = await request(server).put(`/api/genres/${id}`).send({name: 'new genre'});
            expect(res.status).toBe(404);
        });

        it('should return 400 if genre"s name is invalid', async()=>{
            const genre1 = new Genre({name: "genre1"});
            await genre1.save();
            const id = genre1._id;
            const res = await request(server).put(`/api/genres/${id}`).send({name: 'new'});
            expect(res.status).toBe(400);
        });
    });

    describe('DELETE/:id', ()=>{
        let token;
        let id;
        let user;
        let genre;

         const exec = async () => {
                return await request(server)
                    .delete('/api/genres/' + id)
                    .set('x-auth-token', token)
         }
        

        beforeEach(async ()=>{
            genre = new Genre({name: 'genre1'});
            await genre.save();
            id = genre._id; 
            user = new User({name: "Peter", isAdmin: true})
            token = user.generateAuthToken();
            name = 'genre1'
        })
        it('should return 404 if genre"s page not found', async()=>{
            id = mongoose.Types.ObjectId().toHexString();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 401 if user is not auth', async ()=>{
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 403 if user is not admin", async ()=>{
            token = new User({name:'Peter', isAdmin: false}).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should delete genre', async ()=>{
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1')
        })
    })
})