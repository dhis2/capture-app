// @flow
import runRulesForEnrollmentPage from '../../../rules/actionsCreator/runRulesForEnrollmentPage';

const getDataElementsFromProgram = (data) => {
    if (!data?.programStages) { return {}; }
    return data.programStages
        .reduce((acc, curr) => {
            curr.programStageDataElements.forEach((stage) => {
                acc[stage.dataElement.id] = { ...stage.dataElement };
            });
            return acc;
        }, {});
};

const getEventValuesFromEnrollment = (enrollment) => {
    const eventValues = enrollment.events.reduce((acc, currentEvent) => {
        currentEvent.dataValues.forEach((dataValue) => {
            const { dataElement, value } = dataValue;
            acc[dataElement] = { value };
        });
        return acc;
    }, {});
    return eventValues;
};

const getEventsDataFromEnrollment = enrollment => enrollment.events.map(event => ({
    eventId: event.event,
    programId: event.program,
    programStageId: event.programStage,
    orgUnitId: event.orgUnit,
    orgUnitName: event.orgUnitName,
    trackedEntityInstanceId: event.trackedEntityInstance,
    enrollmentId: event.enrollment,
    enrollmentStatus: event.enrollmentStatus,
    status: event.status,
    eventDate: event.eventDate,
    dueDate: event.dueDate,
    ...getEventValuesFromEnrollment(enrollment),
}));

// $FlowFixMe
export const runRulesForEnrollment = ({ orgUnit, program, programMetadata, enrollments, attributes }: Object) => {
    if (programMetadata && attributes && enrollments) {
        const dataElements = getDataElementsFromProgram(programMetadata);

        const trackedEntityAttributes = attributes?.map(item => ({ id: item.attribute, valueType: item.valueType }));
        const teiAttributesValues = attributes?.reduce((acc, item) => {
            acc[item.attribute] = item.value;
            return acc;
        }, {});
        const eventsData = getEventsDataFromEnrollment(enrollments[0]);

        return runRulesForEnrollmentPage({
            program,
            orgUnit,
            allEventsData: eventsData,
            dataElementsInProgram: dataElements,
            teiValues: teiAttributesValues,
            trackedEntityAttributes,
            enrollmentData: { enrollmentDate: enrollments[0].enrollmentDate,
                incidentDate: enrollments[0].incidentDate,
                enrollmentId: enrollments[0].enrollmentId },
        });
    }
    return undefined;
};
