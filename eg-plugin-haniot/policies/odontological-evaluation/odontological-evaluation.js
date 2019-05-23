
const account = require('../../services/account/account-service');
const ehr = require('../../services/ehr/ehr-service');
const mhealth = require('../../services/mhealth/mhealth-service');
const analytics = require('../../services/analytics/analytics-service');

module.exports = function (actionParams) {

    return async (req, res, next) => {

        try {
            const pilotstudy = req.body.pilotstudy;
            if (!pilotstudy) {
                return res.status(404).send({ 'code': 404, 'message': 'PILOTSTUDY NOT FOUND', 'description': 'A pilot study was not found in the body of the requisition.' });
            }

            const health_professional_id = req.body.health_professional_id;
            if (!health_professional_id) {
                throw new Error('HEALTHPROFESSIONALID_NOTFOUND')
            }

            let listOfPatients = new Array();

            let listOfPatientsInformation = new Array();

            listOfPatients = await account.getAllPatientsByPilotStudyId(pilotstudy.id);

            if (listOfPatients && listOfPatients.length) {
                for (let i = 0; i < listOfPatients.length; i++) {

                    const patient = listOfPatients[i];

                    const lastQuestionnaires = await ehr.getLastQuestionnaires(patient.id);

                    const measurements = await mhealth.getMeasurements(patient.id, pilotstudy.start, pilotstudy.end);

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

                    if (i === listOfPatients.length - 1) {
                        return analytics.createOdontologicalEvaluation(listOfPatientsInformation);
                    }
                }
            }
            /**
             * TODO: O que retornar se o estudo piloto não tiver nenhum paciente?
             */
            return res.status(200).send();

        } catch (err) {

            if (err.message === 'PILOTSTUDY_NOTFOUND') return res.status(404).send({ 'code': 404, 'message': 'PILOTSTUDY NOT FOUND', 'description': 'A pilot study was not found in the body of the requisition.' });
            if (err.message === 'HEALTHPROFESSIONALID_NOTFOUND') return res.status(404).send({ 'code': 404, 'message': 'HEALTHPROFESSIONALID NOT FOUND', 'description': 'The health professional id was not found in the body of the requisition' });

            return res.status(500).send(err);
        }
    }
};
