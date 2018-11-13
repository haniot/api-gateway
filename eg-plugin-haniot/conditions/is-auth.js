module.exports = {
  name: 'is-auth',
  handler: function (req, conditionConfig) {    
    return (conditionConfig.urlauthservice == req.url && req.method === 'POST');
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/conditions/no-auth.json',
    type: 'object',
    properties: {
      urlauthservice: {
        type: 'string'
      }
    },
    required: ['urlauthservice']
  }
};
