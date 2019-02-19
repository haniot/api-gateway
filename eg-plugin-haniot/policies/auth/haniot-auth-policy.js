/**
 * Login Policy
 * 
 */
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
      },
      secretOrPublicKey: {
        type: 'string'
      },
      secretOrPublicKeyFile: {
        type: 'string'
      },
      issuer: {
        type: 'string'
      }
    },
    required: ['urlauthservice','issuer'],
    oneOf: [{ required: ['secretOrPublicKey'] }, { required: ['secretOrPublicKeyFile'] }]
  }
};
