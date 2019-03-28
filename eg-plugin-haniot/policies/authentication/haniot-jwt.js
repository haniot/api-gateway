/**
 * Policy to validate JWT
 */
let passport = require('passport');
const passportJWT = require("passport-jwt");
let services = require('express-gateway/lib/services');
const HttpStatus = require('http-status');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function (actionParams, testContext) {

    /**
     * Test Context
     * testContext.services and testContext.passport are mockados services
     */
    if (testContext && testContext.isTest) {
        services = testContext.services;
        passport = testContext.passport;
    }

    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretOrKey,
        issuer: actionParams.issuer
    }, (jwtPayload, done) => {
        /**
         * At this point both the jwt signature, issuer and experation were validated
         * Futhermore, we have the jwt payload decoded and we can access its attributes
         */
        
        /**
         *  User validation. We expect to receive the username in the jwt 'sub' field
         */
        if (!jwtPayload.sub) {
            return done(null, false);
        }

        /**
         * Verifying that the user is registered as a consumer at the gateway
         */
        services.auth.validateConsumer(jwtPayload.sub, { checkUsername: true })
            .then((consumer) => {
                if (!consumer) {//invalid username or inctive user
                    return done(null, false, { message: 'Invalid or inactive user' }); 
                }
                return done(null, jwtPayload); //jwt successfully authenticated
            }).catch((err) => {
                if (err.message === 'CREDENTIAL_NOT_FOUND') {
                    console.error(new Date().toUTCString() + ' | haniot-jwt | Credential not found! ', err);
                    return done(null, false, { message: 'User not found' });
                }
                console.error(new Date().toUTCString() + ' | haniot-jwt | Error in validateConsumer', err);
                return done(err);
            });
    }));
    
    return (req, res, next) => {         
        passport.authenticate('jwt', { session: false },(err, user, info) =>{
            if(info && info.message === 'No auth token') return res.status(HttpStatus.UNAUTHORIZED).send({"code": 401,"message": "UNAUTHORIZED","description": "Authentication failed for lack of authentication credentials.","redirect_link": "/auth"});
            if(info && info.message === 'Invalid or inactive user') return res.status(HttpStatus.UNAUTHORIZED).send({"code": 401,"message": "UNAUTHORIZED","description": "The token user is not properly registered as a consumer at the gateway.","redirect_link": "/auth"});
            if(info && info.message === 'jwt expired') return res.status(HttpStatus.UNAUTHORIZED).send({"code": 401,"message": "UNAUTHORIZED","description": "Authentication failed because access token is expired.","redirect_link": "/auth"});
            if(info && info.message === 'jwt issuer invalid. expected: haniot') return res.status(HttpStatus.UNAUTHORIZED).send({"code": 401,"message": "UNAUTHORIZED","description": "Authentication failed because the access token contains invalid parameters.","redirect_link": "/auth"});
            if(info && info.message) return res.status(HttpStatus.UNAUTHORIZED).send({"code": 401,"message": "UNAUTHORIZED","description": "Authentication failed due to access token issues.","redirect_link": "/auth"});
            req.user = user;
            next();
        })(req, res, next);
    }
};