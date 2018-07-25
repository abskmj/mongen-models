/**
 * This plugin is dependent on password plugin 
 */

const JWTUtility = require('@abskmj/jwt-utility');

module.exports = (schema, options) => {
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
}
