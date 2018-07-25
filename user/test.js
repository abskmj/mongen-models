const mongen = require("@abskmj/mongen");
const expect = require("chai").expect;

const config = require('../config.json');

describe('User', () => {
    let mongoose;
    let User;
    let userData = {
        name: "ABC",
        email: "abc@xyz.com",
        password: 'test123'
    };

    before(async() => {
        let mongooseInstance = await mongen.init({
            mongo: config.mongo,
            path: __dirname + '/models'
        });
        mongoose = mongooseInstance;
        User = mongoose.model('User');
    });

    beforeEach(async() => {
        await mongoose.connection.dropDatabase();
    });

    it('should record timestamp of creation', async() => {
        let savedUser = await User.create(userData);
        expect(savedUser).to.have.property('createdAt');
    });

    it('should record timestamp of modification', async() => {
        // create a new user
        let savedUser = await User.create(userData);
        expect(savedUser).to.have.property('modifiedAt');

        // find the same user and modify it
        let foundUser = await User.findById(savedUser.id);
        foundUser.name = 'XYZ';
        let savedUser2 = await foundUser.save();

        // check that updatedAt timestamp is changed
        expect(savedUser.modifiedAt).to.not.equal(savedUser2.modifiedAt);

    });

    it('should set a password', async() => {
        // create a new user
        let savedUser = await User.create(userData);
        
        expect(savedUser).to.have.property('_hash');
        expect(savedUser).to.have.property('_salt');
    });
    
    it('should login with email', async() => {
        // create a new user
        let savedUser = await User.create(userData);
        
        // get a JWT
        let jwt = await User.login({ email: userData.email , password: userData. password});
        expect(jwt.split('.')).to.have.lengthOf(3);
    });
    
    it('should translate JWT', async() => {
        // create a new user
        let savedUser = await User.create(userData);
        
        // get a JWT
        let jwt = await User.login({ email: userData.email , password: userData. password});
        expect(jwt.split('.')).to.have.lengthOf(3);
        
        // translate the same JWT to get the user back
        let user = await User.translateToken(jwt);
        expect(user.id).to.equal(savedUser.id);
    });
});