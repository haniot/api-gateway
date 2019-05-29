'use strict'

const fs = require('fs')
const gateway = require('express-gateway')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const SSL_KEY_PATH = process.env.SSL_KEY_PATH
const SSL_CERT_PATH = process.env.SSL_CERT_PATH

if (!fs.existsSync(SSL_KEY_PATH)) {
    console.error(`SSL key required!\nPlease provide the ssl key in the .env file in SSL_KEY_PATH.`)
    process.exit()
}

if (!fs.existsSync(SSL_CERT_PATH)) {
    console.error(`SSL certificate required!\nPlease provide the ssl certificate in the .env file in SSL_CERT_PATH.`)
    process.exit()
}

/* Start Gateway */
gateway()
    .load(path.join(__dirname, 'config'))
    .run()