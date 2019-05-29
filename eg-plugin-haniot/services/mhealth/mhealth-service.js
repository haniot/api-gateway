'use strict'

/**
 * Service created to request in MHEALTH SERVICE
 */
const https = require('https')
const axios = require('axios');

const mhealth = {};
const MHEALTH_SERVICE = process.env.MHEALTH_SERVICE;


const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

/**
 * Function used to return all collected measurements between date_start and date_end.
 * @param patient_id
 * @param date_start
 * @param date_end
 * @returns {Promise<any | never>}
 */
mhealth.getMeasurements = function (patient_id, date_start, date_end) {
    return instance
        .get( `${MHEALTH_SERVICE}/users/${patient_id}/measurements?timestamp=gte:${date_start}&timestamp=lte:${date_end}`)
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data));
}

module.exports = mhealth;
