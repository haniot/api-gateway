'use strict'

/**
 * Service created to request in ANALYTICS SERVICE
 */
const https = require('https')
const axios = require('axios')

const analytics = {}
const ANALYTICS_SERVICE = process.env.ANALYTICS_SERVICE

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

/**
 * Function used to submit a dental evaluation
 * @param patientsInfo
 * @param pilotstudy_id
 * @returns {AxiosPromise<any>}
 */
analytics.createOdontologicalEvaluation = function (patientsInfo, pilotstudy_id) {
    return instance
        .post(
            `${ANALYTICS_SERVICE}/pilotstudies/${pilotstudy_id}/odontological/evaluations`,
            patientsInfo
        )
}

module.exports = analytics
