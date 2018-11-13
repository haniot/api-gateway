const authService = require('../../services/auth/auth-service');
const jwt = require('jsonwebtoken');
const services = require('express-gateway/lib/services');

module.exports = function (actionParams) {
    return (req, res, next) => {
        return authService.auth('http://localhost:5000/api/v1/users/auth', req.headers.authorization)
            .then(response => {
                if (response.status === 200) {// Login realizado com sucesso, criar usuario no Gateway
                    jwt.verify(response.data['acess_token'], 'mysecret', function (err, jwtPayload) {
                        if (err) {
                            console.log('| policy auth |Error:', err);
                            return res.status(400).send({ message: err.message });
                        }
                        // console.log(`JwtDecode: ${JSON.stringify(jwtPayload)}`);
                        //User validation. We expect to receive the username in the jwt 'sub' field
                        if (!jwtPayload.sub) {
                            return res.status(400).send({ message: "Username not found!" });
                        }

                        services.user.find(jwtPayload.sub)
                            .then(user => {
                                console.log('Found user: ' + JSON.stringify(user));
                                if(user) {
                                    return res.status(200).send(response.data);
                                }
                                let userGateway = { username: jwtPayload.sub };
                                services.user.insert(userGateway)
                                    .then(user => {
                                        console.log('User created on API gateway: ' + JSON.stringify(user));
                                        return res.status(200).send(response.data);
                                    }).catch(error => {
                                        console.log(`Error creating API Gateway user: ${error.message}`);
                                        return res.status(400).send({ messsage: error.message });
                                    });
                            })
                            .catch( err => {
                                console.log('| policy auth | Error fetching user: ' + JSON.stringify(err));
                            });

                    });
                } else {// Login invalido
                    console.log('Login invalido!');
                    return res.status(400).send(response.data);
                }
            })
            .catch(err => {
                console.log('| policy auth | Error:', err);
                return res.status(400).send({ message: err.message });
            });

    }
};