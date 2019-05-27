/**
 * Service created to request in ANALYTICS SERVICE
 */

const analytics = {};
const axios = require('axios');
const ANALYTICS_SERVICE = process.env.ANALYTICS_SERVICE;


analytics.createOdontologicalEvaluation = function (patientsInfo) {
    return axios.
        request({
            method: 'POST',
            url: `${ANALYTICS_SERVICE}/pilotstudies/${pilotstudy_id}/odontological/evaluations`,
            data: patientsInfo
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

module.exports = analytics;
