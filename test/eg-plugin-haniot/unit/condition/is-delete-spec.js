const condition = require('../../../../eg-plugin-haniot/conditions/is-delete');
const assert = require('chai').assert;

describe('Condition: is-delete',()=>{
    describe('Integrity',()=>{
        it('Field "name" is type valid',()=>{
            assert.typeOf(condition.name, 'string', '"name" is not string type');
            assert.equal(condition.name, 'is-delete','Condition name other than expected');        
        });
        it('Field "handler" is type valid',()=>{
            assert.typeOf(condition.handler, 'function', '"handler" is not function type');        
        });
        it('Field "schema" is type valid',()=>{
            assert.typeOf(condition.schema, 'object', '"schema" is not object type');        
        });
        it('Field "schema.$id" is type valid',()=>{
            assert.typeOf(condition.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(condition.schema.$id, 'http://express-gateway.io/schemas/conditions/is-delete.json', '"schema.$id" different than expected');
        });
        it('Field "schema.type" is type valid',()=>{
            assert.typeOf(condition.schema.type, 'string', '"schema.type" is not object type');
            assert.equal(condition.schema.type, 'object', '"schema.type" different than expected');
        });
        it('Field "schema.properties" is type valid',()=>{
            assert.typeOf(condition.schema.properties, 'object', '"schema.properties" is not object type');
        });
        it('Field "schema.properties.deletepath" is type valid',()=>{
            assert.typeOf(condition.schema.properties.deletepath,'object', '"schema.properties.deletepath" is not object type');
            assert.typeOf(condition.schema.properties.deletepath.type,'string', '"schema.properties.deletepath" is not object type');
        });  
                  
    });

    describe('Functionality',()=>{
        it('When request is /users/5cb1235ss with method DELETE',()=>{
            const req = {
                url:'/users/5cb1235ss',
                method: 'DELETE'
            };
            const conditionConfig = {
                deletepath:'/users/\S*'// deletepath é um expressão regular
            }
            assert.equal(true,condition.handler(req,conditionConfig), 'Handler should return "true"');
        });
        it('When the request is /users/5cb1235ss with method other than DELETE',()=>{
            const req = {
                url:'/users/5cb1235ss',
                method: 'PUT'
            };
            const conditionConfig = {
                deletepath:'/users/\S*'// deletepath é um expressão regular
            }
            assert.equal(false,condition.handler(req,conditionConfig), 'Handler should return "true"');
        });
    
    });
});