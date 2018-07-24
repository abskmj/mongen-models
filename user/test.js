const mongen = require("@abskmj/mongen");
const expect = require("chai").expect;

const config = require('../config.json');

describe('User', () => {
    let mongoose;
    let User;
    let userData;

    before((done) => {
        
        
        mongen.init({
                mongo: config.mongo,
                path: __dirname + '/models'
            })
            .then((mongooseInstance) => {
                mongoose = mongooseInstance;
                User = mongoose.model('User');
                userData ={
                    name: "ABC",
                    email: "abc@xyz.com",
                    password: 'test123'
                };
                done();
            });
    });

    beforeEach(async () => {
        await  mongoose.connection.dropDatabase();
        console.log('cleared database');
    });

    it('should record timestamp of creation', async() => {
        let savedUser = await User.create(userData);
        expect(savedUser).to.have.property('createdAt');
    });

    it('should record timestamp of modification', async () => {
        let savedUser = await User.create(userData);
        console.log(savedUser);
        expect(savedUser).to.have.property('updatedAt');
        
        let users = await User.findOne({ id: savedUser.id });
        
        console.log(users);
    });

    // it('should set a password', (done) => {
    //     user.save()
    //         .then((savedUser) => {
    //             expect(savedUser).to.have.property('_hash');
    //             expect(savedUser).to.have.property('_salt');
    //             done();
    //         });
    // })
});

// mongen.init({
//         mongo: 'mongodb://developer:dev%23123@ds245661.mlab.com:45661/dev-playground',
//         path: __dirname + '/models'
//     })
//     .then((mongoose) => {
//         mongoose.connection.dropDatabase()
//             .then(() => {

//                 .then((user) => {
//                     console.log(user.toJSON());

//                     return User.login({
//                         email: 'abc@xyz.com',
//                         password: 'test123'
//                     });

//                 }).then((jwt) => {
//                     console.log('JWT:', jwt);

//                     return User.translateToken(jwt);
//                 }).then(user => {
//                     console.log(user.toJSON());
//                 }).catch(error => {
//                     console.error(error);
//                 });

//             });
//     }).catch(error => {
//         console.error(error);
//     });
