/**
 * Policy to validate scopes
 */
module.exports = {
  name: 'haniot-jwtScopes-policy',
  policy: require('./haniot-jwtScopes'),
  schema: {
    name: 'haniot-jwtScopes-policy',
    $id: 'http://express-gateway.io/schemas/policies/haniot-jwtScopes-policy.json',
  }
};