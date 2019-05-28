/**
 * Service created to request in MHEALTH SERVICE
 */

const mhealth = {};
const axios = require('axios');
const MHEALTH_SERVICE = process.env.MHEALTH_SERVICE;

/**
 * Function used to return all collected measurements between date_start and date_end.
 * @param patient_id
 * @param date_start
 * @param date_end
 * @returns {Promise<any | never>}
 */
mhealth.getMeasurements = function (patient_id, date_start, date_end) {

    return axios.
        request({
            method: 'GET',
            url: `${MHEALTH_SERVICE}/users/${patient_id}/measurements`,
            params: {
                type: 'blood_glucose,height,waist_circumference,weight',
                timestamp: `gte:${date_start}`,
                timestamp: `lte:${date_end}`
            }
        })
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

module.exports = mhealth;
