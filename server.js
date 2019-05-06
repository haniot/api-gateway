'use strict'

const fs = require('fs-extra')
const path = require('path')
const gateway = require('express-gateway')
const dotenv = require('dotenv')
const defaults = require('./default')

dotenv.load()

// Create certificates (HTTPS certificates and JWT public key ) directory if it doesn't exists
const SSL_KEY_PATH = process.env.SSL_PRIVATE_KEY_PATH || defaults.SSL_PRIVATE_KEY_PATH
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || defaults.SSL_CERT_PATH
const JWT_KEY_PATH = process.env.JWT_PUBLIC_KEY_PATH || defaults.JWT_PUBLIC_KEY_PATH
const AUTO_GENERATE_SSL = process.env.GENERATE_SELF_SIGNED_CERT || defaults.AUTO_GENERATE_SSL_CERTIFICATE
const NODE_ENV = process.env.NODE_ENV || defaults.NODE_ENV
let jwt_public_key_interval = undefined

if (AUTO_GENERATE_SSL === 'true') {
    generateSelfSignedSSL()
        .then(res => {
            console.log(`Successfully created self-signed certificates!`)
            // Waits for public key used in JWT token verification.
            // Normally it will be created by another micro-service (account-service).
            jwt_public_key_interval = setInterval(waitFileSync, 1000, JWT_KEY_PATH)
        })
        .catch(err => {
            console.error(`There was an error generating the self-signed certificate: `, err.message)
            process.exit()
        })
} else { // production
    if (!verifySSL()) {
        console.error(`SSL certificates were not found in SSL_PRIVATE_KEY_PATH and SSL_CERT_PATH.`)
        process.exit()
    }
    // Waits for public key used in JWT token verification.
    // Normally it will be created by another micro-service (account-service).
    jwt_public_key_interval = setInterval(waitFileSync, 1000, JWT_KEY_PATH)
}

function verifySSL() {
    // Verifies that SSL certificates have been provided
    return fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)
}

function waitFileSync(filePath) {
    if (fs.existsSync(filePath)) {
        clearInterval(jwt_public_key_interval)
        /* Start Gateway */
        gateway()
            .load(path.join(__dirname, 'config'))
            .run()
    } else {
        console.log('Waiting JWT public key...')
    }
}

function generateSelfSignedSSL() {
    return new Promise((resolve, reject) => {
        require('pem').createCertificate({days: 365, selfSigned: true}, (err, keys) => {
            if (err) {
                console.error('Failure generating self-signed HTTPS certificates:\r\n' + err)
                return reject(err)
            }
            // Store certificates in the file system
            try {
                fs.outputFileSync(SSL_KEY_PATH, keys.serviceKey, 'ascii')
                fs.outputFileSync(SSL_CERT_PATH, keys.certificate, 'ascii')

                resolve({key: keys.serviceKey, cert: keys.certificate})
            } catch (err) {
                console.error('Failure saving self-signed HTTPS certificates:\r\n' + err)
                reject(err)
            }
        })
    })
}
