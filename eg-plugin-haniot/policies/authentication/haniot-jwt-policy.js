module.exports = {
  name: 'haniot-jwt-policy',
  policy: require('./haniot-jwt'),
  schema: {
    name: 'haniot-jwt-policy',
    $id: 'http://express-gateway.io/schemas/policies/haniot-jwt-policy.json',
    type: 'object',
    properties: {
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
    required: ['issuer'],
    oneOf: [{ required: ['secretOrPublicKey'] }, { required: ['secretOrPublicKeyFile'] }]
  }
};