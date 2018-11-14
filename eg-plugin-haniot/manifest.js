module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/authentication/haniot-jwt-policy'));
    pluginContext.registerPolicy(require('./policies/authorization/haniot-jwtScopes-policy'));
    pluginContext.registerPolicy(require('./policies/auth/haniot-auth-policy'));
    pluginContext.registerCondition(require('./conditions/is-auth'));
    // pluginContext.registerGatewayRoute(require('./routes/user.router-gateway'));

  },
  policies:['haniot-jwt-policy', 'haniot-jwtScopes-policy', 'haniot-auth-policy']
};
