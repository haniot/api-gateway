const passport = require('passport');

module.exports = function (actionParams) { 
    return (req, res, next) => {
        console.log('executing haniot authentication policy with params', actionParams);
        passport.authenticate('jwt', { session: false })(req, res, next);
    }
};