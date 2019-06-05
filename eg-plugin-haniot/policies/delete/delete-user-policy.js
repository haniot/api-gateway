/**
 * Delete user gateway policy
 */
module.exports = {
    name: 'haniot-delete-user-policy',
    policy: require('./delete-user'),
    schema: {
        name: 'haniot-delete-user-policy',
        $id: 'http://express-gateway.io/schemas/policies/haniot-delete-user-policy.json',
        type: 'object',
        properties: {
            urldeleteservice: {
                type: 'string'
            }
        },
        required: ['urldeleteservice']
    }
}
