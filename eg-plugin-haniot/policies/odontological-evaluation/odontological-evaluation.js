
const account = require('../../services/account/account-service');
const ehr = require('../../services/ehr/ehr-service');
const mhealth = require('../../services/mhealth/mhealth-service');
const analytics = require('../../services/analytics/analytics-service');

module.exports = function (actionParams) {

    return async (req, res, next) => {

        try {
            const pilotstudy = req.body.pilotstudy;
            /**
             * If the request does not have a pilot study entity, an exception will be issued 'PILOTSTUDY_NOTFOUND';
             */
            if (!pilotstudy) {
                throw new Error('PILOTSTUDY_NOTFOUND');
            }

            const health_professional_id = req.body.health_professional_id;
            /**
             * If the request does not have a pilot study entity, an exception will be issued 'PILOTSTUDY_NOTFOUND';
             */
            if (!health_professional_id) {
                throw new Error('HEALTHPROFESSIONALID_NOTFOUND');
            }

            /**
             * Object used to store all patient information.
             */
            const listOfPatientsInformation = new Array();

            /**
             * I retrieve the list with all the patients of the pilot study
             */
            const listOfPatients = await account.getAllPatientsByPilotStudyId(pilotstudy.id);
            if (listOfPatients && listOfPatients.length) {
                /**
                 * For each patient I look for their habits and their measurements
                 */
                for (let index in listOfPatients) {

                    const patient = listOfPatients[index];

                    try {
                        /**
                         * I recover the patient's last habits
                         */
                        const lastQuestionnaires = await ehr.getLastQuestionnaires(patient.id);
                        /**
                         * I retrieve patient measurements.
                         */
                        const measurements = await mhealth.getMeasurements(patient.id, pilotstudy.start, pilotstudy.end);

                        /**
                        * Assembly of the final object.
                        */
                        listOfPatientsInformation.push(
                            {
                                patient: patient,
                                measurements: measurements,
                                feeding_habits_record: lastQuestionnaires.nutritional.feeding_habits_record,
                                sleep_habit: lastQuestionnaires.nutritional.sleep_habit,
                                sociodemographic_record: lastQuestionnaires.odontological.sociodemographic_record,
                                family_cohesion_record: lastQuestionnaires.odontological.family_cohesion_record,
                                oral_health_record: lastQuestionnaires.odontological.oral_health_record,
                                health_professional_id: health_professional_id
                            });
                    } catch (e) {
                        /**
                         * If a problem occurs in one of the requests, disregard the current patient and go to the next one.
                         */
                        continue;
                    }


                }

                /**
                 * After gathering all the information send to the analytics service.
                 */
                return analytics.createOdontologicalEvaluation(listOfPatientsInformation, pilotstudy.id)
                    .then(response => {
                        return res.status(response.status).send(response.data);
                    })
                    .catch(err => {
                        
                        if(err.response && err.response.data){
                            return res.status(err.response.status).send(err.response.data);
                        }
                        return res.status(500).send(handlerMessageError(err.message));
                    });

            }

            /**
             * If the pilot study does not contain patients, an exception will be issued 'PILOTSTUDY_EMPTY'
             */
            throw new Error('PILOTSTUDY_EMPTY');

        } catch (err) {

            /**
             * Check the error type according to the message property and set its return.
             */
            if (err && err.message === 'PILOTSTUDY_NOTFOUND') return res.status(404).send(handlerMessageError('PILOTSTUDY_NOTFOUND'));
            if (err && err.message === 'HEALTHPROFESSIONALID_NOTFOUND') return res.status(404).send(handlerMessageError('HEALTHPROFESSIONALID_NOTFOUND'));
            if (err && err.message === 'PILOTSTUDY_EMPTY') return res.status(400).send(handlerMessageError('PILOTSTUDY_EMPTY'));

            /**
             * If the error is not mapped in the above options, I return an error 500;
             */
            return res.status(500).send(handlerMessageError(err.message));
        }
    }
};

/**
 * Handler of general error messages.
 *
 * @param message
 * @returns {{code: number, message: string, description: string}}
 */
function handlerMessageError(message) {
    if (message === 'PILOTSTUDY_NOTFOUND') return {
        'code': 404,
        'message': 'PILOTSTUDY NOT FOUND',
        'description': 'A pilot study was not found in the body of the requisition.'
    }

    else if (message === 'HEALTHPROFESSIONALID_NOTFOUND') return {
        'code': 404,
        'message': 'HEALTHPROFESSIONALID NOT FOUND',
        'description': 'The health professional id was not found in the body of the requisition.'
    }

    else if (message === 'PILOTSTUDY_EMPTY') return {
        'code': 400,
        'message': 'PILOTSTUDY EMPTY',
        'description': 'It was not possible to generate evaluation because the study does not have registered patients.'
    }

    return {
        'code': 500,
        'message': 'INTERNAL SERVER ERROR',
        'description': 'An internal server error has occurred.'
    }
}
