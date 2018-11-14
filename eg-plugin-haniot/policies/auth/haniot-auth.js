/**
 * Login Policy
 */
const authService = require('../../services/auth/auth-service');
const jwt = require('jsonwebtoken');
const services = require('express-gateway/lib/services');

module.exports = function (actionParams) {
    return (req, res, next) => {
        console.log('executing haniot auth policy with params:');
        console.log(actionParams);
        return authService.auth(actionParams.urlauthservice, req.headers.authorization)
            .then(response => {
                if (response.status === 200) {// Login realizado com sucesso, criar usuario no Gateway
                    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;
                    jwt.verify(response.data['acess_token'], secretOrKey, function (err, jwtPayload) {
                        if (err) {
                            console.log('| policy auth | Error:', err);
                            return res.status(400).send({ message: err.message });
                        }
                        //User and issuer validation. We expect to receive the username in the jwt 'sub' field and issuer in 'issuer' field
                        if (!jwtPayload.sub || jwtPayload.iss !== actionParams.iss) {
                            console.error('| policy auth | User not found in jwt or issuer invalid!');
                            return res.status(400).send({ message: "User not found in jwt or issuer invalid!" });
                        }
                        // Searching for user on express gateway
                        services.user.find(jwtPayload.sub)
                            .then(user => {
                                if(user) {
                                    console.log('| policy auth | Found user: ' + JSON.stringify(user.username));
                                    return res.status(200).send(response.data);
                                }
                                let userGateway = { username: jwtPayload.sub };
                                services.user.insert(userGateway)
                                    .then(user => {
                                        console.log('| policy auth | User created on API gateway: ' + JSON.stringify(user));
                                        return res.status(200).send(response.data);
                                    }).catch(error => {
                                        console.error(`| policy auth | Error creating API Gateway user: ${error.message}`);
                                        return res.status(400).send({ messsage: error.message });
                                    });
                            })
                            .catch( err => {
                                console.error('| policy auth | Error fetching user: ' + JSON.stringify(err));
                                return res.status(500).send({ messsage: 'Error fetching user: '+error.message });
                            });

                    });
                } else {// Login invalido
                    console.log('| policy auth | Invalid login!!');
                    return res.status(400).send(response.data);
                }
            })
            .catch(err => {
                console.error('| policy auth | Error:', err);
                return res.status(400).send({ message: err.message });
            });

    }
};