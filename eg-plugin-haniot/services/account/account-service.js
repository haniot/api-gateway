/**
 * Service created to request in ACCOUNT SERVICE
 */

const account = {};
const axios = require('axios');
const ACCOUNT_SERVICE = process.env.ACCOUNT_SERVICE;

account.getPatientById = function (patient_id) {
    return axios.
        request({
            method: 'GET',
            url: `${ACCOUNT_SERVICE}/users/patients/${patient_id}`
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err));
}

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
        .catch(err => Promise.reject(err));
}

account.getPilotStudyById = function (pilotstudy_id) {
    return axios.
        request({
            method: 'GET',
            url: `${ACCOUNT_SERVICE}/pilotstudies/${pilotstudy_id}`
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err));
}

module.exports = account;
