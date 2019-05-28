/**
 * Service created to request in EHR SERVICE
 */

const ehr = {};
const axios = require('axios');
const EHR_SERVICE = process.env.EHR_SERVICE;

/**
 * Function used to return the last habits of a patient.
 * @param patient_id
 * @returns {Promise<any | never>}
 */
ehr.getLastQuestionnaires = function (patient_id) {
    return axios.
        request({
            method: 'GET',
            url: `${EHR_SERVICE}/patients/${patient_id}/questionnaires/last`
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

module.exports = ehr;
