/**
 * Plug-in export file
 * Where all plug-in policies, conditions, and routes are logged
 */
module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy(require('./policies/authentication/haniot-jwt-policy'));
    pluginContext.registerPolicy(require('./policies/authorization/haniot-jwtScopes-policy'));
    pluginContext.registerPolicy(require('./policies/auth/haniot-auth-policy'));
    pluginContext.registerPolicy(require('./policies/body-parser/haniot-body-parser-policy'));
    pluginContext.registerPolicy(require('./policies/delete/haniot-delete-user-policy'));
    pluginContext.registerCondition(require('./conditions/is-auth'));
    pluginContext.registerCondition(require('./conditions/is-delete'));
    pluginContext.registerGatewayRoute(require('./routes/haniot-middlewares'));
    pluginContext.registerGatewayRoute(require('./routes/haniot-documentation'));
  },
  policies:['haniot-jwt-policy', 'haniot-jwtScopes-policy', 'haniot-auth-policy','haniot-body-parser-policy','haniot-delete-user-policy']
};
