/**
 * Policy to validate scopes
 */
const jwtz = require('express-jwt-authz');
module.exports = function (actionParams) {
    return (req, res, next) => {
        console.log('executing haniot authorization policy with params');
        console.log(actionParams);
        jwtz(req.egContext.apiEndpoint.scopes)(req, res, next);
    }
};