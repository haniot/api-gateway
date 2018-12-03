/**
 * Login Policy
 */
const jwt = require('jsonwebtoken');
let authService = require('../../services/auth/auth-service');
let services = require('express-gateway/lib/services');
const HttpStatus = require('http-status');

module.exports = function (actionParams, authServiceTest, servicesTest) {
    return (req, res, next) => {     
        /**Test Context
         * authService and services are mockados services
         */
        if (authServiceTest && servicesTest) {
            authService = authServiceTest;
            services = servicesTest;
        }
        /**
         * Function to search for a user or create it
         * @param {*} id User ID registered at gateway
         */
        const findOrCreateUserGateway = (id) => {
            /**
             * Searching for user on express gateway
             */
            return services.user.find(id)
                .then(user => {
                    if (user) {
                        return user;
                    }
                    let userGateway = { username: id };
                    /**
                     * Creating user on gateway
                     */
                    return services.user.insert(userGateway)
                        .then(user => {
                            return user;
                        })
                        .catch(err => {
                            console.error(new Date().toUTCString() + '| haniot-auth | Error inserting user gateway: ' + err);
                            return false;
                        });
                })
                .catch(err => {
                    console.error(new Date().toUTCString() + '| haniot-auth | Error fetching user gateway: ' + err);
                    return false;
                });
        }
        /**
         * Performing user authentication on the account service
         */
        return authService.auth(actionParams.urlauthservice, req.body)
            .then(response => {
                /**
                 * Login successfully, create user on Gateway
                 */
                if (response.status === HttpStatus.OK) {
                    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;
                    jwt.verify(response.data['token'], secretOrKey, {issuer:actionParams.issuer}, function (err, jwtPayload) {
                        if (err) {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "code": 500, "message": "INTERNAL SERVER ERROR", "description": "An internal server error has occurred." });
                        }
                        /**
                         * User and issuer validation.
                         * We expect to receive the username in the jwt 'sub' field and issuer in 'issuer' field
                         */
                        if (!jwtPayload.sub) {
                            return res.status(HttpStatus.UNAUTHORIZED).send({ "code": 401, "message": "UNAUTHORIZED", "description": "The token user is not properly registered as a consumer at the gateway.", "redirect_link": "/api/v1/users/auth" });
                        }
                        /**
                         * Calls the function to fetch or create the user at the gateway
                         */
                        return findOrCreateUserGateway(jwtPayload.sub)
                            .then(user => {
                                if (user) {
                                    response.user = user;
                                    return res.status(response.status).send(response.data);
                                } else {
                                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "code": 500, "message": "INTERNAL SERVER ERROR", "description": "An internal server error has occurred." });
                                }
                            });

                    });
                } else {
                    return res.status(response.status).send(response.data);
                }
            })
            .catch(err => {
                /**
                 * In case of connection errors with the microservice
                 */
                if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
                    console.error(new Date().toUTCString() + '| haniot-auth | Error in authService: ', err.message);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "code": 500, "message": "INTERNAL SERVER ERROR", "description": "An internal server error has occurred." });
                }
                /**
                 * If the user needs to update the access password
                 */
                if (err.response && err.response.status === HttpStatus.FORBIDDEN) {
                    const index_users = err.response.data.redirect_link.indexOf('users');
                    const id = err.response.data.redirect_link.substring(index_users).split('/')[1];                                        
                    /**
                     * Calls the function to fetch or create the user at the gateway
                     */
                    return findOrCreateUserGateway(id)
                        .then(user => {
                            if (user) {
                                res.user = user;
                                return res.status(err.response.status).send(err.response.data);
                            } else {
                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ "code": 500, "message": "INTERNAL SERVER ERROR", "description": "An internal server error has occurred." });
                            }
                        });

                }
                return res.status(err.response.status).send(err.response.data);
            });

    }
};
