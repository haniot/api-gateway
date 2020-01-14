# HANIoT API Gateway

[![License][license-image]][license-url] [![Node][node-image]][node-url] [![Dependencies][dependencies-image]][dependencies-url] [![DependenciesDev][dependencies-dev-image]][dependencies-dev-url] [![Vulnerabilities][known-vulnerabilities-image]][known-vulnerabilities-url] [![Commit][last-commit-image]][last-commit-url] [![Releases][releases-image]][releases-url] [![Contributors][contributors-image]][contributors-url]  [![Swagger][swagger-image]][swagger-url] 

HANIoT Platform APIs Manager. It is responsible for routing requests or blocking access to resources provided by the internal microservices that make up the HANIoT platform. Express Gateway is used.

## Prerequisites
- [Node 8.0.0+](https://nodejs.org/en/download/)
- [Redis](https://redis.io/download/)

## Set the environment variables
Application settings are defined by environment variables. To define the settings, make a copy of the `.env.example file`, naming for `.env`. After that, open and edit the settings as needed. The following environments variables are available:

| VARIABLE | DESCRIPTION  | DEFAULT |
|-----|-----|-----|
| `NODE_ENV` | Defines the environment in which the application runs. You can set: `test` _(in this environment, the database defined in `MONGODB_URI_TEST` is used and the logs are disabled for better visualization of the test output)_, `development` _(in this environment, all log levels are enabled)_ and `production` _(in this environment, only the warning and error logs are enabled)_. | `development` |
| `API_GATEWAY_SERVICE` | URI used to connect to the API Gateway public API.  | `https://localhost:443` |
| `PORT_HTTP` | Port used by the API GATEWAY service to listen for HTTP request. | `80` |
| `PORT_HTTPS` | Port used by the API GATEWAY service to listen for HTTPS request. | `443` |
| `RECAPTCHA_SERVER_KEY` | Server key used for reCaptcha. | `s3rv3rk3y` |
| `ISSUER` | The issuer used to validate the JWT token sent for requests. The value must be provided by the Account service that generates the token. | `haniot` |
| `SSL_KEY_PATH` | SSL/TLS certificate private key. | `.certs/server.key` |
| `SSL_CERT_PATH` | SSL/TLS certificate. | `.certs/server.crt` |
| `JWT_PUBLIC_KEY_PATH` | Public key used to generate and validate JSON Web Token (JWT). The value must be provided by the Account service that generates the token. | `.certs/jwt.key.pub` |
| `ACCOUNT_SERVICE` | URI used to connect to the Account service. | `https://localhost:3001` |
| `MHEALTH_SERVICE` | URI used to connect to the MHealth service. | `https://localhost:4001` |
| `EHR_SERVICE` | URI used to connect to the EHR service. | `https://localhost:5001` |
| `ANALYTICS_SERVICE` | URI used to connect to the Analytics service. | `https://localhost:6001` |
| `NOTIFICATION_SERVICE` | URI used to connect to the Notification service. | `https://localhost:7001` |
| `TIME_SERIES_SERVICE` | URI used to connect to the Time Series service. | `https://localhost:8001` |
| `DS_AGENT_SERVICE` | URI used to connect to the DS Agent service. | `https://localhost:9001` |
| `EMULATE_REDIS` | Signals whether the redis bank will be emulated or not. | `true` |
| `PORT_REDIS` | Redis instance port. | `6379` |
| `HOST_REDIS` | Redis instance hostname. | `localhost` |

## Generate Certificates
For development and testing environments the easiest and fastest way is to generate your own self-signed certificates. These certificates can be used to encrypt data as well as certificates signed by a CA, but users will receive a warning that the certificate is not trusted for their computer or browser. Therefore, self-signed certificates should only be used in non-production environments, that is, development and testing environments. To do this, run the `create-self-signed-certs.sh` script in the root of the repository.
```sh
$ chmod +x ./create-self-signed-certs.sh
$ ./create-self-signed-certs.sh
```
The following files will be created: `ca.crt`, `server.crt` and `server.key`.

Remember that JWT public key `(JWT_PUBLIC_KEY_PATH)` must be the same as used by Account Service.

In production environments its highly recommended to always use valid certificates and provided by a certificate authority (CA). A good option is [Let's Encrypt](https://letsencrypt.org)  which is a CA that provides  free certificates. The service is provided by the Internet Security Research Group (ISRG). The process to obtain the certificate is extremely simple, as it is only required to provide a valid domain and prove control over it. With Let's Encrypt, you do this by using [software](https://certbot.eff.org/) that uses the ACME protocol, which typically runs on your host. If you prefer, you can use the service provided by the [SSL For Free](https://www.sslforfree.com/)  website and follow the walkthrough. The service is free because the certificates are provided by Let's Encrypt, and it makes the process of obtaining the certificates less painful.

## Installation and Execution
#### 1. Install dependencies
```sh  
$ npm install    
```
 
#### 2. Run Server
```sh  
$ npm start
```

Navigate to `https://localhost:{PORT_HTTPS}`


[//]: # (These are reference links used in the body of this note.)
[license-image]: https://img.shields.io/badge/license-Apache%202-blue.svg
[license-url]: https://github.com/haniot/api-gateway/blob/master/LICENSE
[node-image]: https://img.shields.io/badge/node-%3E%3D%208.0.0-brightgreen.svg
[node-url]: https://nodejs.org
[known-vulnerabilities-image]: https://snyk.io/test/github/haniot/api-gateway/badge.svg
[known-vulnerabilities-url]: https://snyk.io/test/github/haniot/api-gateway
[dependencies-image]: https://david-dm.org/haniot/api-gateway.svg
[dependencies-url]: https://david-dm.org/haniot/api-gateway
[dependencies-dev-image]: https://david-dm.org/haniot/api-gateway/dev-status.svg
[dependencies-dev-url]: https://david-dm.org/haniot/api-gateway?type=dev
[swagger-image]: https://img.shields.io/badge/swagger-v1-brightgreen.svg
[swagger-url]: https://https://app.swaggerhub.com/apis/haniot/api-gateway/v2
[last-commit-image]: https://img.shields.io/github/last-commit/haniot/api-gateway.svg
[last-commit-url]: https://github.com/haniot/api-gateway/commits
[releases-image]: https://img.shields.io/github/release-date/haniot/api-gateway.svg
[releases-url]: https://github.com/haniot/api-gateway/releases
[contributors-image]: https://img.shields.io/github/contributors/haniot/api-gateway.svg
[contributors-url]: https://github.com/haniot/api-gateway/graphs/contributors
