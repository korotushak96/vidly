const request = require('supertest');
const {User} = require('../../modules/user');
const {Genre} = require('../../modules/genre');

describe('auth', ()=>{
    let token;
    beforeEach( async ()=>{ 
        server = require('../../script');
    });
    afterEach(  async () =>{ 
        await Genre.remove({});
    });
    


    const exec = async () => {
        return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'genre1'});
    };

    beforeEach(()=>{
        token = new User().generateAuthToken();
    });
    

    it('should return 401, if no token is received', async ()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async ()=>{
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    })
})