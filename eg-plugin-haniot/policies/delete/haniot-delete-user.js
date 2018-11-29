/**
* Delte user gateway policy
*/

const userServiceGateway = require('express-gateway/lib/services').user;
const axios = require('axios');

module.exports = function (actionParams) {
  return (req, res, next) => {
    const index_users = req.url.indexOf('users');
    const id = req.url.substring(index_users).split('/')[1];
    return deleteUserAccount(actionParams.urldeleteservice, id)
      .then(result => {
        /**
         * User excluded from account and gateway service
         */
        return res.status(204).send();
      })
      .catch(err => {
        return res.status(err.response.status).send(err.response.data);
      });
  }
};

/**
 * Function used to exclude the user from the account service and shortly after deleting it from the gateway
 * @param {*} urlAccountService account service url
 * @param {*} user_id id of the user to be excluded
 */
const deleteUserAccount = (urldeleteservice, user_id) => {
  return axios.request({
    method: 'DELETE',
    url: urldeleteservice + '/' + user_id
  }).then(response => {
    return userServiceGateway.findByUsernameOrId(user_id).then(userSaved => {
      if (userSaved) {
        return userServiceGateway.remove(userSaved.id).then(result => {
          return result;
        }).catch(error => {
          console.log(new Date().toUTCString() + ' | haniot-delete-user | Error removing API Gateway user: ' + error.message);
          return Promise.reject(error);
        });
      }
    });
  }).catch(error => {
    console.error(new Date().toUTCString() + ' | haniot-delete-user | Error removing Account user:', error.message);
    return Promise.reject(error);
  });
}
