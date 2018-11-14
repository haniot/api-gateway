/**
 * Condição para verficar se a rota requisitada é a de login
 */
module.exports = {
  name: 'is-auth',
  handler: function (req, conditionConfig) {    
    return (conditionConfig.autpath == req.url && req.method === 'POST');
  },
  schema: {
    $id: 'http://express-gateway.io/schemas/conditions/no-auth.json',
    type: 'object',
    properties: {
      autpath: {
        type: 'string'
      }
    },
    required: ['autpath']
  }
};
