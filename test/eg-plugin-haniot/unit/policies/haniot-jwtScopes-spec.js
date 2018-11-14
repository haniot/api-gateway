const policy = require('../../../../eg-plugin-haniot/policies/authorization/haniot-jwtScopes-policy');
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Policy: haniot-jwtScopes-policy',()=>{
    describe('Integrity',()=>{
        it('Field "name" is type valid',()=>{
            assert.typeOf(policy.name, 'string', '"name" is not string type');
            assert.equal(policy.name, 'haniot-jwtScopes-policy','Policy name other than expected');        
        });
        it('Field "policy" is type valid',()=>{
            assert.typeOf(policy.policy, 'function', '"policy" is not function type');        
        });
        it('Field "schema" is type valid',()=>{
            assert.typeOf(policy.schema, 'object', '"schema" is not object type');        
        });
        it('Field "schema.$id" is type valid',()=>{
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/haniot-jwtScopes-policy.json', '"schema.$id" different than expected');
        });
        it('Field "schema.type" is type valid',()=>{
            assert.typeOf(policy.schema.type, 'string', '"schema.type" is not object type');
            assert.equal(policy.schema.type, 'object', '"schema.type" different than expected');
        });   
        it('Field "schema.properties" is type valid',()=>{
            assert.typeOf(policy.schema.properties, 'object', '"schema.properties" is not object type');
        });   
    });

    describe('Functionality',()=>{
        it('Should return a function(req,res,next)',()=>{
            assert.typeOf(policy.policy(), 'function', '"policy" does not return a function');
        });
        it('You should get the apiendpoint scopes',()=>{
            const req = {
                headers : {
                    authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Yjk5NmE5NTZjZGRlOTAwMzk5MjJkZGUiLCJpc3MiOiJoYW5pb3QiLCJpYXQiOjE1MzcyMjI4MTAsInNjb3BlIjoidXNlcnM6cmVhZEFsbDIifQ.0K8y01LStace9qQx5rMwN3hDJoy3dNxc5u91CId4I7c'
                },
                egContext : {
                    apiEndpoint : {
                        scopes: ['users:readAll','users:readAll2']
                    }
                }
            };
            
            const res = {
                send:sinon.spy(),
                status:sinon.spy()
            };
            res.status.withArgs(200).returns(res);            
            const next = sinon.spy();

            // Executando a politica
            mid_policy = policy.policy();
            mid_policy(req,res,next);

            sinon.assert.calledOnce(res.send);
            sinon.assert.calledWith(res.status, 200);
        });       
        
    });
});