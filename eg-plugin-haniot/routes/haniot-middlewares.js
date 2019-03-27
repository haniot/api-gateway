/**
 * File to configuration globals middlewares 
 */
module.exports = function (expressGatewayApp) {

    const allowCors = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
        res.header('Accept-Charset', 'utf-8');
        res.header('Access-Control-Allow-Credentials', true);
        next();
    };


    expressGatewayApp.use(allowCors);


};
