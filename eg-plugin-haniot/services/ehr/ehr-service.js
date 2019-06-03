'use strict'

/**
 * Service created to request in EHR SERVICE
 */
const https = require('https')
const axios = require('axios')

const ehr = {}
const EHR_SERVICE = process.env.EHR_SERVICE

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

/**
 * Function used to return the last habits of a patient.
 * @param patient_id
 * @returns {Promise<any | never>}
 */
ehr.getLastQuestionnaires = function (patient_id) {
    return instance.get(`${EHR_SERVICE}/patients/${patient_id}/questionnaires/last`)
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data))
}

module.exports = ehr
