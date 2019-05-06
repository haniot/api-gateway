module.exports = {
    NODE_ENV: 'development', // execution environment,

    API_GATEWAY_SERVICE: 'https://localhost:443', //URI used to connect to the API Gateway public API
    PORT_HTTP: 8080, // HTTP port used to expose API Gateway public API
    PORT_HTTPS: 443, // HTTPS port used to expose API Gateway public API

    ACCOUNT_SERVICE: 'http://localhost:3000',
    MHEALTH_SERVICE: 'http://localhost:4000',
    EHR_SERVICE: 'http://localhost:5000',
    ANALYTICS_SERVICE: 'http://localhost:6000',
    NOTIFICATION_SERVICE: 'http://localhost:7000',

    HOST_REDIS: 'localhost', // If using REDIS database (EMULATE_REDIS=false), it defines the database
    PORT_REDIS: 6379, // If using REDIS database (EMULATE_REDIS=false), it defines the database
    EMULATE_REDIS: true, // emulated database, all the data is be lost if the gateway is restarted

    ISSUER: 'haniot', // issuer used to validate the JWT token sent into the requests
    JWT_PUBLIC_KEY_PATH: './.certs/jwt.pem', // JWT public key used for token verification
    AUTO_GENERATE_SSL_CERTIFICATE: true, // Indicates whether to create the SSL certificate automatically.
    SSL_PRIVATE_KEY_PATH: './.certs/tls.key', // SSL certificate private key
    SSL_CERT_PATH: './.certs/tls.pem', // SSL certificate (public key0)
}
