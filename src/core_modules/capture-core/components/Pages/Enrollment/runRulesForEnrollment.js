// @flow
import { convertValue } from 'capture-core/converters/serverToClient';
import runRulesForEnrollmentPage from '../../../rules/actionsCreator/runRulesForEnrollmentPage';


const getDataElementsFromProgram = (data, eventsDataValues) => {
    if (!data?.programStages) { return {}; }
    return data.programStages
        .reduce((acc, curr) => {
            curr.programStageDataElements.forEach((stage) => {
                const { id, valueType } = stage.dataElement;
                const { value } = eventsDataValues.find(item => item.dataElement === id) || { };
                acc[id] = { ...stage.dataElement };
                if (value) {
                    acc[stage.dataElement.id].value = convertValue(value, valueType);
                }
            });
            return acc;
        }, {});
};

const getEventValuesFromEnrollment = (enrollment, dataElements) => {
    const eventValues = enrollment.events.reduce((acc, currentEvent) => {
        currentEvent.dataValues.forEach((dataValue) => {
            const { dataElement } = dataValue;
            acc[dataElement] = dataElements[dataElement].value;
        });
        return acc;
    }, {});
    return eventValues;
};

const getEventsDataFromEnrollment = (enrollment, dataElements) => enrollment.events.map(event => ({
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
    ...getEventValuesFromEnrollment(enrollment, dataElements),
}));


const getEnrollmentData = enrollment => ({ enrollmentDate: enrollment.enrollmentDate,
    incidentDate: enrollment.incidentDate,
    enrollmentId: enrollment.enrollmentId });

const flatDataValuesFromEvents = events => events.reduce((acc, currentEvent) => {
    acc = [...acc, ...(currentEvent.dataValues)];
    return acc;
}, []);

// $FlowFixMe
export const runRulesForEnrollment = ({ orgUnit, program, programMetadata, enrollments, attributes }: Object) => {
    if (programMetadata && attributes && enrollments) {
        const dataValueList = flatDataValuesFromEvents(enrollments[0].events);
        const dataElements = getDataElementsFromProgram(programMetadata, dataValueList);

        const trackedEntityAttributes = attributes?.map(item => ({ id: item.attribute, valueType: item.valueType }));
        const teiAttributesValues = attributes?.reduce((acc, item) => {
            acc[item.attribute] = item.value;
            return acc;
        }, {});
        const eventsData = getEventsDataFromEnrollment(enrollments[0], dataElements);

        return runRulesForEnrollmentPage({
            program,
            orgUnit,
            allEventsData: eventsData,
            dataElementsInProgram: dataElements,
            teiValues: teiAttributesValues,
            trackedEntityAttributes,
            enrollmentData: getEnrollmentData(enrollments[0]),
        });
    }
    return undefined;
};
