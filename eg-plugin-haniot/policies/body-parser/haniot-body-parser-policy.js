/**
 * Policy to convert req in object javascript
 */
module.exports = {
    name: 'haniot-body-parser-policy',
    policy: require('./haniot-body-parser'),
    schema: {
      $id: 'http://express-gateway.io/schemas/policies/haniot-body-parser-policy.json',
      type: 'object',
      properties: {}
    }
  };