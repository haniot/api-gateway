# eg-plugin-haniot

This plugin adds custom policies to the Express Gateway. For more information about Express Gateway plug-ins, see the documentation [Express Gateway - Plugins](https://www.express-gateway.io/docs/plugins/)

### How to manually install 
1. Add "eg-plugin-haniot": "file: eg-plugin-haniot" the project dependencies in package.json
2. Run "npm install" for the plugin to be added installed in the node_modules folder
3. Add the installed plugin to the gateway system settings in the file "system.config.yml". As in the example below:
![Plugin](https://drive.google.com/uc?id=1mHJif10TMf3Uvu1ejv7lEkZWztj12V6X)
4. Okay, done that it is already possible to use the policies in "gateway.config.yml"

### How to install automatically

Plugins are bundled as Node modules and distributed through npm. The Express Gateway CLI is used to install and configure plugins.
Installed plugins are declared in the system.config.yml and are then ready to be used. Express Gateway CLI is a convenient way to install and enable plugins.
```bash
$ eg plugin install name-of-the-plugin-published-in-npm
```

### Description of policies

* haniot-body-parser-policy: Converts the request into an object using the body-parser.
  + No configuration parameters
* haniot-auth-policy: Performs authentication and then validates the consumer at the express gateway.
  + Configuration parameters:
    - urlauthservice: Indicates authentication service url. (ie 'http://localhost:5000/api/users/auth')
    - secretOrPublicKey: String with the secret to validate JWT token. (ie 'mysecret')
    - secretOrPublicKeyFile: File with the secret to validate JWT token. (ie 'key.pem')
    - issuer: Valid JWT token issuer. (ie 'myapp')
* haniot-jwt-policy: Validates token jwt based on expiration time and emitter. In addition to verifying the existence of the respective consumer. NOTE: In the case of the jwt secret, it can be informed using one of two properties: "secretOrPublicKey" or "secretOrPublicKeyFile".
  + Configuration parameters:    
    - secretOrPublicKey: String with the secret to validate JWT token. (ie 'mysecret')
    - secretOrPublicKeyFile: File with the secret to validate JWT token. (ie 'key.pem')
    - issuer: Valid JWT token issuer. (ie 'myapp')
* haniot-jwtScopes-policy: Performs the validation of the necessary scopes in the requests. Remembering that each scope must be configuring in each apiPublica path. In case of multiple scopes, the policy verifies the existence of at least one of the scopes.
  + No configuration parameters