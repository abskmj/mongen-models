/**
 * This plugin is dependent on password plugin 
 */

const JWTUtility = require('@abskmj/jwt-utility');

module.exports = (schema, options) => {
    const defaults = {
        jwt: {
            hash: 'HS256',
            issuer: 'AuthServer',
            subject: 'Login',
            expiry: 120000,
            secret: 'changeit'
        },
        prop: 'email'
    }

    options = Object.assign(options, defaults);

    schema.statics.login = async function(data) {
        let query = {};
        query[options.prop] = data[options.prop];
        let inst = await this.findOne(query)

        if (inst) {
            if (inst.validatePassword(data.password)) {

                return JWTUtility.getFactory(options.jwt.hash)
                    .setIssuer(options.jwt.issuer)
                    .setSubject(options.jwt.subject)
                    .setExpiry(options.jwt.expiry)
                    .setClaims({
                        uid: inst._id.toString(),
                    })
                    .sign(options.jwt.secret);
            }
            else {
                throw new Error('Password is invalid');
            }
        }
        else {
            throw new Error(this.modelName + ' not found with ' + options.prop + ': ' + data[options.prop]);
        }
    }

    schema.statics.translateToken = async function(jwt) {
        let data = JWTUtility.getParser()
            .validateIssuer(options.jwt.issuer)
            .validateSubject(options.jwt.subject)
            .parse(jwt, options.jwt.secret);

        return await this.findById(data.claims.uid);
    }
}
