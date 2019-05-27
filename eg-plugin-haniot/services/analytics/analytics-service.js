/**
 * Service created to request in ANALYTICS SERVICE
 */

const analytics = {};
const axios = require('axios');
const ANALYTICS_SERVICE = process.env.ANALYTICS_SERVICE;


analytics.createOdontologicalEvaluation = function (patientsInfo, pilotstudy_id) {
    
    return axios.
        request({
            method: 'POST',
            url: `${ANALYTICS_SERVICE}/pilotstudies/${pilotstudy_id}/odontological/evaluations`,
            data: patientsInfo
        });
}

module.exports = analytics;
