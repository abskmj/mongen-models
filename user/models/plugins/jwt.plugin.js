/**
 * This plugin is dependent on password plugin 
 */

const JWTUtility = require('@abskmj/jwt-utility');

module.exports = (schema, {
    hash = 'HS256',
    issuer = 'AuthServer',
    subject = 'Login',
    expiry = 120000,
    secret = 'changeit'
}) => {
    schema.statics.login = function(data) {
        try {
            return this.findOne({ email: data.email })
                .then(user => {
                    if (user) {
                        if (user.validatePassword(data.password)) {

                            let jwt = JWTUtility.getFactory(hash)
                                .setIssuer(issuer)
                                .setSubject(subject)
                                .setExpiry(expiry)
                                .setClaims({
                                    user: user._id.toString(),
                                })
                                .sign(secret);

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
                .validateIssuer(issuer)
                .validateSubject(subject)
                .parse(jwt, secret);

            return this.findById(data.claims.user);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
