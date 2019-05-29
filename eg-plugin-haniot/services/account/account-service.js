'use strict'

/**
 * Service created to request in ACCOUNT SERVICE
 */
const axios = require('axios')
const https = require('https')

const account = {}
const ACCOUNT_SERVICE = process.env.ACCOUNT_SERVICE

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

/**
 * Function used to perform authentication
 * @param {*} credentials
 */
account.auth = function (credentials) {
    return instance.post(`${ACCOUNT_SERVICE}/auth`, credentials)
}

/**
 * Function used to search for a patient
 * @param {*} patient_id
 */
account.getPatientById = function (patient_id) {
    return instance.get(`${ACCOUNT_SERVICE}/users/patients/${patient_id}`)
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data))
}

/**
 * Function used to search all patients for a pilot study
 * @param {*} pilotstudy_id
 */
account.getAllPatientsByPilotStudyId = function (pilotstudy_id) {
    return instance.get(`${ACCOUNT_SERVICE}/pilotstudies/${pilotstudy_id}/patients?limit=${Number.MAX_SAFE_INTEGER}`)
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data))
}

/**
 * Function used to search for a pilot study
 * @param {*} pilotstudy_id
 */
account.getPilotStudyById = function (pilotstudy_id) {
    return instance.get(`${ACCOUNT_SERVICE}/pilotstudies/${pilotstudy_id}`)
        .then(response => Promise.resolve(response.data))
        .catch(err => Promise.reject(err.response.data))
}

/**
 * Function used to exclude the user from the account service and shortly after deleting it from the gateway
 * @param {*} user_id
 */
account.deleteUserById = function (user_id) {
    return instance.delete(`${ACCOUNT_SERVICE}/users/${user_id}`)
        .then(response => {
            return Promise.resolve(response.data)
        }).catch(error => {
            console.error(new Date().toUTCString() + ' | haniot-delete-user | Error removing Account user:' + error.message)
            return Promise.reject(err.response.data)
        })
}

module.exports = account
