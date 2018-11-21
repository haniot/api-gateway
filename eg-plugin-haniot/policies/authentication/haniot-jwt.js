/**
 * Policy to validate JWT
 */
const passport = require('passport');
const passportJWT = require("passport-jwt");
let services = require('express-gateway/lib/services');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function (actionParams, testContext) {
    let extractor = ExtractJWT.fromAuthHeaderAsBearerToken;
    // Contexto de teste.
    // testContext possui os serviços mockados
    if (testContext && testContext.isTest) {
        services = testContext.services;
        extractor = testContext.fakeExtractor;
    }

    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;

    passport.use(new JWTStrategy({
        jwtFromRequest: extractor(),
        secretOrKey: secretOrKey,
        issuer: actionParams.issuer
    }, (jwtPayload, done) => {
        //At this point both the jwt signature, issuer and experation were validated
        // Futhermore, we have the jwt payload decoded and we can access its attributes
        // console.log(`JWT payload: ${JSON.stringify(jwtPayload)}`);

        //User validation. We expect to receive the username in the jwt 'sub' field
        if (!jwtPayload.sub) {            
            return done(null, false);
        }
        
        services.auth.validateConsumer(jwtPayload.sub, { checkUsername: true })
            .then((consumer) => {
                if (!consumer) {
                    // console.log('invalid username or inctive user');
                    return done(null, false, { message: 'Invalid or inactive user' }); //invalid username or inctive user
                }
                // console.log('jwt successfully authenticated');
                return done(null, jwtPayload); //jwt successfully authenticated
            }).catch((err) => {
                if (err.message === 'CREDENTIAL_NOT_FOUND') {
                    // console.log('CREDENTIAL_NOT_FOUND');
                    return done(null, false, { message: 'User not found' });
                }
                return done(err);
            });
    }
    ));
    return (req, res, next) => {
        // Contexto de teste.
        if (testContext && testContext.isTest) {
            passport.authenticate()(req, res, next);
        } else {
            passport.authenticate('jwt', { session: false })(req, res, next);
        }
    }
};