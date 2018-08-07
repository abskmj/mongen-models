const JWTUtility = require('@abskmj/jwt-utility');

module.exports = (schema, options) => {
    const defaults = {
        jwt: {
            hash: 'HS256',
            issuer: 'AuthServer',
            subject: 'Verification',
            expiry: 120000,
            secret: 'changeit'
        },
        prop: 'email'
    }

    options = Object.assign(defaults, options);

    let capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let propName = capitalizeFirstLetter(options.prop);

    let isVerifiedProp = `is${propName}Verified`;
    let getVerificationMethod = `get${propName}VerificationToken`;
    let translateVerificationTokenMethod = `translate${propName}VerificationToken`;


    let propDef = {};
    propDef[isVerifiedProp] = { type: Boolean, default: false };

    schema.add(propDef);

    schema.methods[getVerificationMethod] = function() {
        return JWTUtility.getFactory(options.jwt.hash)
            .setIssuer(options.jwt.issuer)
            .setSubject(options.jwt.subject)
            .setExpiry(options.jwt.expiry)
            .setClaims({
                uid: this._id.toString(),
            })
            .sign(options.jwt.secret);
    }
    
    schema.statics[translateVerificationTokenMethod] = async function(jwt) {
        let data = JWTUtility.getParser()
            .validateIssuer(options.jwt.issuer)
            .validateSubject(options.jwt.subject)
            .parse(jwt, options.jwt.secret);

        return await this.findById(data.claims.uid);
    }
};
