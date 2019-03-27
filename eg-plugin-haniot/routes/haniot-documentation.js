/**
 * Routes to expose HANIoT API swagger documentation
 */
const swaggerUi = require('swagger-ui-express');

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
                  content: url(http://nutes.uepb.edu.br/wp-content/uploads/2016/05/footer-N.fw_.png);
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
    customfavIcon: 'http://nutes.uepb.edu.br/wp-content/uploads/2014/01/icon.fw_.png',
    customSiteTitle: `API Reference | HANIoT`
  }
  expressGatewayApp.get('/', (req, res) => {
    res.redirect('/api/v1/reference');
  });

  expressGatewayApp.use('/api/v1/reference', swaggerUi.serve, (req, res) => {
    swaggerUi.setup(null, options)(req, res);
  });

};
