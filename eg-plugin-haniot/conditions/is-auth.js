/**
 * Condition to verify if the requested route is the login and method is POST
 */
module.exports = {
  name: 'is-auth',
  handler: function (req, conditionConfig) {    
    return (conditionConfig.authpath === req.url && req.method === 'POST');
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/conditions/is-auth.json',
    type: 'object',
    properties: {
      authpath: {
        type: 'string'
      }
    },
    required: ['authpath']
  }
};
