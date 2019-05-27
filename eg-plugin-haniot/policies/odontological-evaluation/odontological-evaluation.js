
const account = require('../../services/account/account-service');
const ehr = require('../../services/ehr/ehr-service');
const mhealth = require('../../services/mhealth/mhealth-service');
const analytics = require('../../services/analytics/analytics-service');

module.exports = function (actionParams) {

    return async (req, res, next) => {

        try {
            const pilotstudy = req.body.pilotstudy;
            if (!pilotstudy) {
                throw new Error('PILOTSTUDY_NOTFOUND');
            }

            const health_professional_id = req.body.health_professional_id;
            if (!health_professional_id) {
                throw new Error('HEALTHPROFESSIONALID_NOTFOUND');
            }

            const listOfPatientsInformation = new Array();

            const listOfPatients = await account.getAllPatientsByPilotStudyId(pilotstudy.id);

            if (listOfPatients && listOfPatients.length) {

                for (let patient in listOfPatients) {
                    let lastQuestionnaires;
                    try {
                        lastQuestionnaires = await ehr.getLastQuestionnaires(patient.id)
                    }catch (e) {
                        lastQuestionnaires = {
                            nutritional: {
                                feeding_habits_record: {},
                                sleep_habit: {}
                            },
                            odontological: {
                                sociodemographic_record: {},
                                family_cohesion_record: {},
                                oral_health_record: {}
                            }
                        }
                    }

                    let measurements;
                    try {
                        measurements = await mhealth.getMeasurements(patient.id, pilotstudy.start, pilotstudy.end);
                    }catch (e) {
                        measurements = [];
                    }

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
                }

                return analytics.createOdontologicalEvaluation(listOfPatientsInformation);
                
            }

            throw new Error('PILOTSTUDY_EMPTY');

        } catch (err) {

            if (err && err.message === 'PILOTSTUDY_NOTFOUND') return res.status(404).send(handlerMessageError('PILOTSTUDY_NOTFOUND'));
            if (err && err.message === 'HEALTHPROFESSIONALID_NOTFOUND') return res.status(404).send(handlerMessageError('HEALTHPROFESSIONALID_NOTFOUND'));
            if (err && err.message === 'PILOTSTUDY_EMPTY') return res.status(400).send(handlerMessageError('PILOTSTUDY_EMPTY'));

            return res.status(500).send(err);
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