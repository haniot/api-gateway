'use strict'

/**
 * Routes to expose HANIoT API swagger documentation
 */
const swaggerUi = require('swagger-ui-express')

module.exports = function (expressGatewayApp) {

    const options = {
        swaggerUrl: 'https://api.swaggerhub.com/apis/haniot/haniot-apigw/v1/swagger.json',
        customCss: `.swagger-ui .topbar { 
                    background-color: #00a594;  
                    padding: 10px 0; 
                }
                .swagger-ui .topbar .topbar-wrapper a span { 
                  display: none; 
                }
                .swagger-ui .topbar .topbar-wrapper a { 
                    display: none;
                }
                .swagger-ui .topbar .topbar-wrapper:before { 
                  content: url(/images/logo-72x72.png);
                  width: 20px;
                  height: 20px;
                  transform: scale(0.05);
                  margin-left: -5px;
                  margin-top: -50px;
              }
                .swagger-ui .topbar .topbar-wrapper:after {  
                    content: 'HANIoT';
                    margin: auto 25px; 
                    padding: 10px 10px;
                    font-size: 1.7em;
                    font-weight: 700;
                    color: #fff; 
                }`,
        customfavIcon: '/images/favicon-16x16.png',
        customSiteTitle: `API Reference | HANIoT`
    }
    expressGatewayApp.get('/', (req, res) => {
        res.redirect('/api/v1/reference')
    })

    expressGatewayApp.use('/api/v1/reference', swaggerUi.serve, (req, res) => {
        swaggerUi.setup(null, options)(req, res)
    })
}
