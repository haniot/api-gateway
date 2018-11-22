/**
 * Login Policy
 */
const jwt = require('jsonwebtoken');
let authService = require('../../services/auth/auth-service');
let services = require('express-gateway/lib/services');

module.exports = function (actionParams,authServiceTest,servicesTest) {
    return (req, res, next) => {        
        // Contexto de teste.
        // authService  e services são serviços mockados
        if(authServiceTest && servicesTest){ 
            authService = authServiceTest;
            services = servicesTest;
        }
        // const credentials = req.headers.authorization ? req.headers.authorization : req.headers['authorization'];
        // const data =  new Buffer(credentials.split(" ")[1], 'base64').toString().split(':');
        return authService.auth(actionParams.urlauthservice, req.body)
            .then(response => {                
                if (response.status === 200) {// Login realizado com sucesso, criar usuario no Gateway
                    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;
                    jwt.verify(response.data['token'], secretOrKey, function (err, jwtPayload) {
                        if (err) {
                            // console.error('| haniot-auth | Error in verify jwt token: ',err);                            
                            return res.status(500).send({ messsage: 'INTERNAL SERVER ERROR' });
                        }
                        //User and issuer validation. We expect to receive the username in the jwt 'sub' field and issuer in 'issuer' field
                        if (!jwtPayload.sub || jwtPayload.iss !== actionParams.issuer) {                            
                            return res.status(400).send({ message: "User not found in jwt or issuer invalid!" });
                        }
                        // Searching for user on express gateway
                        services.user.find(jwtPayload.sub)
                            .then(user => {
                                if(user) {                                    
                                    return res.status(200).send(response.data);
                                }
                                let userGateway = { username: jwtPayload.sub };
                                services.user.insert(userGateway)
                                    .then(user => { 
                                        response.user = user;                                      
                                        return res.status(200).send(response.data);
                                    }).catch(err => { 
                                        console.error('| haniot-auth | Error inserting user gateway: '+err.message);                                       
                                        return res.status(500).send({ messsage: 'INTERNAL SERVER ERROR' });
                                    });
                            })
                            .catch( err => {
                                console.error('| haniot-auth | Error fetching user gateway: '+err.message);                                
                                return res.status(500).send({ messsage: 'INTERNAL SERVER ERROR'});
                            });
                    });
                } else {                 
                    return res.status(response.status).send(response.data);
                }
            })
            .catch(err => {   
                console.error('| haniot-auth | Error in authService: '+err.message);                
                return res.status(500).send({ messsage: 'INTERNAL SERVER ERROR' });
            });

    }
};