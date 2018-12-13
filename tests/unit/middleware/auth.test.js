const auth = require('../../../middleware/auth.js');
const {User} = require('../../../modules/user');
const mongoose = require('mongoose');

describe('autth middleware', ()=>{
    it('should populate req.user with the payload of valid JWT', ()=>{
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    })
})