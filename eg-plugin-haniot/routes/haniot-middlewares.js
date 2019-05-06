'use strict'

const defaults = require('../../default')
const cors = require('cors')
const port_https = process.env.PORT_HTTPS || defaults.PORT_HTTPS

/**
 * File to configuration globals middlewares
 */
module.exports = function (app) {
    var corsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

    app.use(cors(corsOptions))

    // Redirect HTTP to HTTPS
    app.enable('trust proxy')
    app.use(function (req, res, next) {
        if (req.secure) {
            next() // request was via https, so do no special handling
        } else {
            // request was via http, so redirect to https
            const host = req.headers.host || ''
            if (host.includes(':')) {
                res.writeHead(301, {Location: `https://${host.replace(/:\d+/, ':'.concat(port_https))}${req.url}`})
            } else {
                res.writeHead(301, {Location: `https://${host}${':'.concat(port_https)}${req.url}`})
            }
            res.end()
        }
    })
}
