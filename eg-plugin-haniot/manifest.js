'use strict'

/**
 * Plug-in export file
 * Where all plug-in policies, conditions, and routes are logged
 */
module.exports = {
    version: '1.0.0',
    init: function (pluginContext) {
        pluginContext.registerPolicy(require('./policies/authentication/jwt-policy'))
        pluginContext.registerPolicy(require('./policies/authorization/jwt-scopes-policy'))
        pluginContext.registerPolicy(require('./policies/auth/auth-policy'))
        pluginContext.registerPolicy(require('./policies/body-parser/body-parser-policy'))
        pluginContext.registerPolicy(require('./policies/delete/delete-user-policy'))
        pluginContext.registerCondition(require('./conditions/regex-path-method'))
        pluginContext.registerGatewayRoute(require('./routes/middlewares'))
        pluginContext.registerGatewayRoute(require('./routes/api-reference'))
    },
    policies: ['haniot-jwt-policy', 'haniot-jwtScopes-policy', 'haniot-auth-policy',
        'haniot-body-parser-policy', 'haniot-delete-user-policy']
}
