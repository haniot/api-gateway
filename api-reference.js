'use strict'

/**
 * Routes to expose HANIoT API swagger documentation
 */
const swaggerUi = require('swagger-ui-express')

module.exports = function (expressGatewayApp) {

    const options = {
        swaggerUrl: 'https://api.swaggerhub.com/apis/haniot/api-gateway/v2/swagger.json',
        customCss: `.swagger-ui .topbar { 
                    background-color: #00a594;  
                    padding: 14px 0; 
                }
                .swagger-ui .topbar .topbar-wrapper a span { 
                  display: none; 
                }
                .swagger-ui .topbar .topbar-wrapper a { 
                    display: none;
                }
                .swagger-ui .topbar .topbar-wrapper:before { 
                  content: url(/images/logo_nutes_48x48.png);
                  margin-left: -5px;
              }
                .swagger-ui .topbar .topbar-wrapper:after {  
                    content: 'HANIoT'; 
                    margin: 0;
                    padding: 0 10px;
                    font-size: 1.7em;
                    font-weight: 700;
                    color: #fff; 
                }`,
        customfavIcon: '/images/favicon-16x16.png',
        customSiteTitle: `API Reference | HANIoT`
    }

    expressGatewayApp.get('/', (req, res, next) => {
        if (req.hostname === (process.env.API_GATEWAY_HOSTNAME || '')) {
            return res.redirect('/v1/reference')
        }
        next()
    })

    expressGatewayApp.use('/v1/reference', swaggerUi.serve, (req, res) => {
        swaggerUi.setup(null, options)(req, res)
    })
}
