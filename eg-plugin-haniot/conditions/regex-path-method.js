/**
 * Condition to verify that the requested meets the regular expression and method configured
 */
module.exports = {
    name: 'regex-path-method',
    handler: function (req, conditionConfig) {
        const regex = new RegExp(conditionConfig.regexpath);
        return (regex.test(req.url) && req.method === conditionConfig.method);
    },
    schema: {
        $id: 'http://express-gateway.io/schemas/conditions/regex-path-method.json',
        type: 'object',
        properties: {
            regexpath: {
                type: 'string'
            },
            method: {
                type: 'string'
            }
        },
        required: ['regexpath', 'method']
    }
};
