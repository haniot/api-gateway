/**
 * Policy to validate scopes
 */
module.exports = {
  name: 'haniot-jwtScopes-policy',
  policy: require('./haniot-jwtScopes'),
  schema: {
    $id: 'http://express-gateway.io/schemas/policies/haniot-jwtScopes-policy.json',
    type: 'object',
    properties: {}
  }
};