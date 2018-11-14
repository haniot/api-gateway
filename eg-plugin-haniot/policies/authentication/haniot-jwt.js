/**
 * Policy to validate JWT
 */
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function (actionParams) {
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'mysecret',
        iss: 'haniot'
    }, (jwtPayload, done) => {
        
        console.log(`JWT payload: ${JSON.stringify(jwtPayload)}`);   

        return done(null,jwtPayload);
    }
    ));
    return (req, res, next) => {
        console.log('executing haniot authentication policy with params');
        console.log(actionParams);
        passport.authenticate('jwt', { session: false })(req, res, next);
    }
};