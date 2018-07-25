const crypto = require('crypto');

module.exports = (schema, options) => {

    const defaults = {
        hash: {
            iterations: 10000,
            keylen: 256,
            digest: 'sha256'
        }
    }

    options = Object.assign(options, defaults);


    schema.add({ _hash: String });
    schema.add({ _salt: String });

    schema.virtual('password').set(function(value) {
        this._salt = crypto.randomBytes(16).toString('hex');
        this._hash = hash(value, this._salt);
    });

    schema.methods.validatePassword = function(password) {
        return this._hash === hash(password, this._salt);
    }

    const hash = (password, salt) => {
        return crypto.pbkdf2Sync(password,
            salt,
            options.hash.iterations,
            options.hash.keylen,
            options.hash.digest).toString('hex');
    }

};
