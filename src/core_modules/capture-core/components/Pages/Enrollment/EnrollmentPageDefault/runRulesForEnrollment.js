// @flow
import { convertValue } from 'capture-core/converters/serverToClient';
import runRulesForEnrollmentPage from 'capture-core/rules/actionsCreator/runRulesForEnrollmentPage';
import { dataElementTypes } from '../../../../metaData';
import type { InputRuleEnrollmentData } from './types/common.types';

// $FlowFixMe
const convertDate = (date: string): string => convertValue(date, dataElementTypes.DATE);

const getDataElementsFromProgram = (data, eventsDataValues) => {
    if (!data?.programStages) { return {}; }
    return data.programStages
        .reduce((acc, stage) => {
            stage.programStageDataElements.forEach((programStageDataElement) => {
                const { id, valueType, optionSet } = programStageDataElement.dataElement;
                const { value } = eventsDataValues.find(item => item.dataElement === id) || { };
                acc[id] = {
                    id,
                    valueType,
                };
                if (optionSet) {
                    acc[id].optionSetId = optionSet.id;
                }
                if (value) {
                    acc[id].value = convertValue(value, valueType);
                }
            });
            return acc;
        }, {});
};

const getEventValuesFromEvent = (enrollment, eventId, dataElements) => {
    const currentEvent = enrollment.events.find(item => item.event === eventId);
    const eventValues = {};
    if (currentEvent) {
        currentEvent.dataValues.forEach((dataValue) => {
            const { dataElement } = dataValue;
            eventValues[dataElement] = dataElements[dataElement].value;
        });
    }

    return eventValues;
};


const getEventsDataFromEnrollment = (enrollment, dataElements) => {
    const allEvents = enrollment.events.map(event => ({
        eventId: event.event,
        programId: event.program,
        programStageId: event.programStage,
        orgUnitId: event.orgUnit,
        orgUnitName: event.orgUnitName,
        trackedEntityInstanceId: event.trackedEntityInstance,
        enrollmentId: event.enrollment,
        enrollmentStatus: event.enrollmentStatus,
        status: event.status,
        eventDate: convertDate(event.dueDate),
        dueDate: convertDate(event.dueDate),
        ...getEventValuesFromEvent(enrollment, event.event, dataElements),
    }));

    const groupByProgramStageId = allEvents.reduce((acc, currentEvent) => {
        acc[currentEvent.programStageId] = { ...currentEvent };
        return acc;
    }, {});

    return { all: allEvents, byStage: groupByProgramStageId };
};


const getEnrollmentData = enrollment => ({
    enrollmentDate: convertDate(enrollment.enrollmentDate),
    incidentDate: convertDate(enrollment.incidentDate),
    enrollmentId: enrollment.enrollment,
});

const flatDataValuesFromEvents = events => events.reduce((acc, currentEvent) => {
    acc = [...acc, ...(currentEvent.dataValues)];
    return acc;
}, []);

export const runRulesForEnrollment = (input: InputRuleEnrollmentData) => {
    const { orgUnit, program, programMetadata, enrollment, attributes } = input;
    if (orgUnit && program && programMetadata && attributes && enrollment) {
        const dataValueList = flatDataValuesFromEvents(enrollment.events);
        const dataElements = getDataElementsFromProgram(programMetadata, dataValueList);

        const trackedEntityAttributes = attributes.reduce((acc, item) => {
            acc[item.attribute] = { id: item.attribute, valueType: item.valueType };
            return acc;
        }, {});

        const teiAttributesValues = attributes?.reduce((acc, item) => {
            acc[item.attribute] = item.value;
            return acc;
        }, {});

        return runRulesForEnrollmentPage({
            program,
            orgUnit,
            trackedEntityAttributes,
            dataElementsInProgram: dataElements,
            teiValues: teiAttributesValues,
            eventsData: getEventsDataFromEnrollment(enrollment, dataElements),
            enrollmentData: getEnrollmentData(enrollment),
        });
    }
    return undefined;
};
