module.exports = {
  name: 'haniot-auth-policy',
  policy: require('./haniot-auth'),
  schema: {
    name: 'haniot-jwt-policy',
    $id: 'http://express-gateway.io/schemas/policies/haniot-auth-policy.json',
    type: 'object',
    properties: {
      urlauthservice: {
        type: 'string'
      }
    },
    required: ['urlauthservice']
  }
};