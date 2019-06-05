/**
 * Policy to gather information necessary to generate dental evaluation
 */
module.exports = {
    name: 'odontological-evaluation-policy',
    policy: require('./odontological-evaluation'),
    schema: {
        name: 'odontological-evaluation-policy',
        $id: 'http://express-gateway.io/schemas/policies/odontological-evaluation.json',
        type: 'object'
    }
}
