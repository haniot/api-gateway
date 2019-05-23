/**
 * Service created to request in MHEALTH SERVICE
 */

const mhealth = {};
const axios = require('axios');
const MHEALTH_SERVICE = process.env.MHEALTH_SERVICE;

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
        .catch(err => {
            console.log('Erro em measurements: ');
            console.log(err);
            return Promise.reject(err.data);
        });
}

module.exports = mhealth;
