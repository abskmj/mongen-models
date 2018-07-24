const mongoose = require("mongoose");
const crypto = require('crypto');

module.exports = (schema) => {
    schema.pre('save', function(next){
        // hash the password if it is modified
        if(this.isModified('password')){
            this.salt = crypto.randomBytes(16).toString('hex');
            this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512').toString('hex');
        }
        
        next();
    });

    schema.methods.validPassword = function(password) {
        let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    };
}
