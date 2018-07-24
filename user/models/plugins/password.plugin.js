const crypto = require('crypto');
const JWTUtility = require('@abskmj/jwt-utility');

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

    schema.statics.login = function(data) {
        try {
            return this.findOne({ email: data.email })
                .then(user => {
                    if (user) {
                        if (user.validatePassword(data.password)) {

                            let jwt = JWTUtility.getFactory('HS256')
                                .setIssuer('AuthServer')
                                .setSubject('Login')
                                .setExpiry(10)
                                .setClaims({
                                    user: user._id.toString(),
                                })
                                .sign('secret key');

                            return Promise.resolve(jwt);
                        }
                        else {
                            throw new Error('Password is invalid');
                        }
                    }
                    else {
                        throw new Error('User not found with email:', data.email);
                    }
                });
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    schema.statics.translateToken = function(jwt) {
        try {
            let data = JWTUtility.getParser()
                .validateIssuer('AuthServer')
                .validateSubject('Login')
                .parse(jwt, 'secret key');
                
            return this.findById(data.claims.user);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    const hash = (password, salt) => {
        return crypto.pbkdf2Sync(password,
            salt,
            options.hash.iterations,
            options.hash.keylen,
            options.hash.digest).toString('hex');
    }

};
