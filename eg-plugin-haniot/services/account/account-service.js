/**
 * Service created to request in ACCOUNT SERVICE
 */
const account = {};
const axios = require('axios');
const ACCOUNT_SERVICE = process.env.ACCOUNT_SERVICE;

/**
 * 
 * @param {*} credentials 
 */
account.auth = function (credentials) {
    return axios.
        request({
            method: 'POST',
            url: `${ACCOUNT_SERVICE}/auth`,
            data: credentials
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

/**
 * 
 * @param {*} patient_id 
 */
account.getPatientById = function (patient_id) {
    return axios.
        request({
            method: 'GET',
            url: `${ACCOUNT_SERVICE}/users/patients/${patient_id}`
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

/**
 * 
 * @param {*} pilotstudy_id 
 */
account.getAllPatientsByPilotStudyId = function (pilotstudy_id) {
    return axios.
        request({
            method: 'GET',
            url: `${ACCOUNT_SERVICE}/pilotstudies/${pilotstudy_id}/patients`,
            params: {
                limit: Number.MAX_SAFE_INTEGER
            }
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

/**
 * 
 * @param {*} pilotstudy_id 
 */
account.getPilotStudyById = function (pilotstudy_id) {
    return axios.
        request({
            method: 'GET',
            url: `${ACCOUNT_SERVICE}/pilotstudies/${pilotstudy_id}`
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

/**
 * Function used to exclude the user from the account service and shortly after deleting it from the gateway
 * @param {*} user_id 
 */
account.deleteUserById = function (user_id) {
    return axios.request({
        method: 'DELETE',
        url: `${ACCOUNT_SERVICE}/users/${user_id}`
    }).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        console.error(new Date().toUTCString() + ' | haniot-delete-user | Error removing Account user:' + error.message);
        return Promise.reject(err.response.data);
    });
}

module.exports = account;
