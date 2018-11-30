const policy = require('../../../../eg-plugin-haniot/policies/delete/haniot-delete-user-policy');
const assert = require('chai').assert;
const sinon = require('sinon');

describe('Policy: haniot-delete-user-policy', () => {
    describe('Integrity', () => {
        it('Field "name" is type valid', () => {
            assert.typeOf(policy.name, 'string', '"name" is not string type');
            assert.equal(policy.name, 'haniot-delete-user-policy', 'Policy name other than expected');
        });
        it('Field "policy" is type valid', () => {
            assert.typeOf(policy.policy, 'function', '"policy" is not function type');
        });
        it('Field "schema" is type valid', () => {
            assert.typeOf(policy.schema, 'object', '"schema" is not object type');
        });
        it('Field "schema.$id" is type valid', () => {
            assert.typeOf(policy.schema.$id, 'string', '"schema.$id" is not string type');
            assert.equal(policy.schema.$id, 'http://express-gateway.io/schemas/policies/haniot-delete-user-policy.json', '"schema.$id" different than expected');
        });
        it('Field "schema.type" is type valid', () => {
            assert.typeOf(policy.schema.type, 'string', '"schema.type" is not object type');
            assert.equal(policy.schema.type, 'object', '"schema.type" different than expected');
        });
        it('Field "schema.properties" is type valid', () => {
            assert.typeOf(policy.schema.properties, 'object', '"schema.properties" is not object type');
        });
        it('Field "schema.properties.urldeleteservice" is type valid', () => {
            assert.typeOf(policy.schema.properties.urldeleteservice, 'object', '"schema.properties.urldeleteservice" is not object type');
            assert.equal(policy.schema.properties.urldeleteservice.type, 'string', '"schema.properties.urldeleteservice" different than expected');
        });        
    });

    describe('Functionality', () => {
        it('should return a function(req,res,next)', () => {
            const actionParams = { urldeleteservice: 'http://localhost:5000/api/v1/users' };
            assert.typeOf(policy.policy(actionParams), 'function', '"policy" does not return a function');
            assert.equal(policy.policy(actionParams).length, 3, 'Function different than expected');
        });

        context('when the user is excluded from the account service', () => {
            it('must delete user from gateway and return status code 204', function () {
                const req = {
                    url: '/api/v1/users/12345'
                };
                const res = {                    
                    status: sinon.stub(),
                    send: sinon.spy()
                };

                res.status.withArgs(204).returns(res);

                const next = sinon.spy();

                const userFake = {
                    id: '12345',
                    username : 'fakeUser'
                }

                const userServiceGwTest = {
                    findByUsernameOrId() {},
                    remove() {}
                }
                const promisefindByUsernameOrId = Promise.resolve(userFake);
                sinon.stub(userServiceGwTest,'findByUsernameOrId').withArgs().returns(promisefindByUsernameOrId);

                const promiseremove = Promise.resolve(true);
                sinon.stub(userServiceGwTest,'remove').withArgs().returns(promiseremove);

                const axiosTest = {
                    request() {}
                }
                const promiseaxiosTest = Promise.resolve(true);
                sinon.stub(axiosTest,'request').withArgs().returns(promiseaxiosTest);

                const actionParams = {
                    urldeleteservice: "http://localhost:5000/users"                                     
                }

                md_policy = policy.policy(actionParams,userServiceGwTest,axiosTest);
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(axiosTest.request);
                        sinon.assert.calledWith(userServiceGwTest.findByUsernameOrId,'12345');
                        
                        sinon.assert.calledWith(res.status,204);
                        sinon.assert.notCalled(next);                        
                    });
            });
            
            it('If there is an error in removing the user from the gateway, should register a function to try to delete user and return the status code 204', function () {
                const req = {
                    url: '/api/v1/users/12345'
                };
                const res = {                    
                    status: sinon.stub(),
                    send: sinon.spy()
                };

                res.status.withArgs(204).returns(res);

                const next = sinon.spy();

                const userFake = {
                    id: '12345',
                    username : 'fakeUser'
                }

                const userServiceGwTest = {
                    findByUsernameOrId() {},
                    remove() {}
                }

                const error = {
                    message: 'Error in gateway',
                    response:{
                        status: 204,
                        data: {
                           code: 204,
                            message: 'Messagafake',
                            description:'Descriptionfake'
                        }
                    }
                }

                const promisefindByUsernameOrId = Promise.resolve(userFake);
                sinon.stub(userServiceGwTest,'findByUsernameOrId').withArgs().returns(promisefindByUsernameOrId);

                const promiseremove = Promise.reject(error);
                sinon.stub(userServiceGwTest,'remove').withArgs().returns(promiseremove);

                const axiosTest = {
                    request() {}
                }
                sinon.stub(axiosTest,'request').withArgs().resolves(true);

                const actionParams = {
                    urldeleteservice: "http://localhost:5000/users"                                     
                }

                md_policy = policy.policy(actionParams,userServiceGwTest,axiosTest);
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(axiosTest.request);
                        sinon.assert.calledWith(userServiceGwTest.findByUsernameOrId,'12345');
                        
                        sinon.assert.calledWith(res.status,204);
                        sinon.assert.notCalled(next);                        
                    });
            });
            
        }); 
        
        context('when the user is not excluded from the account service',()=>{
            it('do not delete the user from the gateway', ()=>{
                const req = {
                    url: '/api/v1/users/12345'
                };
                const res = {                    
                    status: sinon.stub(),
                    send: sinon.spy()
                };

                res.status.withArgs(404).returns(res);

                const next = sinon.spy();

                const userFake = {
                    id: '12345',
                    username : 'fakeUser'
                }

                const userServiceGwTest = {
                    findByUsernameOrId() {},
                    remove() {}
                }
                const promisefindByUsernameOrId = Promise.resolve(userFake);
                sinon.stub(userServiceGwTest,'findByUsernameOrId').withArgs().returns(promisefindByUsernameOrId);

                const promiseremove = Promise.resolve(true);
                sinon.stub(userServiceGwTest,'remove').withArgs().returns(promiseremove);

                const axiosTest = {
                    request() {}
                }

                const error = {
                    message: 'Error in account service',
                    response:{
                        status: 404,
                        data: {
                            code: 404,
                            message: 'Messagafake',
                            description:'Descriptionfake'
                        }
                    }
                }

                const promiserequest = Promise.reject(error);
                sinon.stub(axiosTest,'request').withArgs().returns(promiserequest);

                const actionParams = {
                    urldeleteservice: "http://localhost:5000/users"                                     
                }

                md_policy = policy.policy(actionParams,userServiceGwTest,axiosTest);
                return md_policy(req, res, next)
                    .then(() => {
                        sinon.assert.calledOnce(axiosTest.request);
                        sinon.assert.notCalled(userServiceGwTest.findByUsernameOrId);
                        sinon.assert.notCalled(userServiceGwTest.remove);
                        sinon.assert.calledWith(res.status,404);
                        sinon.assert.calledWith(res.send,{
                            code: 404,
                            message: 'Messagafake',
                            description:'Descriptionfake'
                        })
                        sinon.assert.notCalled(next);                        
                    });
            });
        });

    });
});