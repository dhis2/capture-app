// @flow
import { convertValue } from 'capture-core/converters/serverToClient';
import { runRulesForEnrollmentPage } from 'capture-core/rules/actionsCreator/runRulesForEnrollmentPage';
import { dataElementTypes, TrackerProgram } from '../../../../metaData';
import type { InputRuleEnrollmentData } from './types/common.types';

// $FlowFixMe
const convertDate = (date: string): string => convertValue(date, dataElementTypes.DATE);

const getDataElementsFromProgram = (data) => {
    if (!data?.programStages) { return {}; }
    return data.programStages
        .reduce((acc, stage) => {
            stage.programStageDataElements.forEach((programStageDataElement) => {
                const { id, valueType, optionSet } = programStageDataElement.dataElement;
                acc[id] = {
                    id,
                    valueType,
                };
                if (optionSet) {
                    acc[id].optionSetId = optionSet.id;
                }
            });
            return acc;
        }, {});
};

const getEventValuesFromEvent = (enrollment, eventId, dataElements) => {
    const currentEvent = enrollment.events.find(item => item.event === eventId);
    if (currentEvent) {
        return currentEvent.dataValues.reduce((acc, dataValue) => {
            const { dataElement: id, value } = dataValue;
            acc[id] = convertValue(value, dataElements[id].valueType);
            return acc;
        }, {});
    }

    return {};
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
        eventDate: convertDate(event.eventDate),
        dueDate: convertDate(event.dueDate),
        ...getEventValuesFromEvent(enrollment, event.event, dataElements),
    }));

    const groupByProgramStageId = allEvents.reduce((acc, currentEvent) => {
        if (!acc[currentEvent.programStageId]) {
            acc[currentEvent.programStageId] = [currentEvent];
        } else {
            acc[currentEvent.programStageId].push(currentEvent);
        }
        return acc;
    }, {});

    return { all: allEvents, byStage: groupByProgramStageId };
};


const getEnrollmentData = enrollment => ({
    enrollmentDate: convertDate(enrollment.enrollmentDate),
    incidentDate: convertDate(enrollment.incidentDate),
    enrollmentId: enrollment.enrollment,
});

export const runRulesForEnrollment = (input: InputRuleEnrollmentData) => {
    const { orgUnit, program, programMetadata, enrollment, attributes } = input;
    if (orgUnit && program && programMetadata && attributes && enrollment) {
        const dataElements = getDataElementsFromProgram(programMetadata);

        const trackedEntityAttributes = attributes.reduce((acc, item) => {
            acc[item.attribute] = {
                id: item.attribute,
                valueType: item.valueType,
            };
            if (program instanceof TrackerProgram) {
                const programAttribute = program.attributes.find(attr => attr.id === item.attribute);
                acc[item.attribute].optionSetId = programAttribute?.optionSet?.id;
            }
            return acc;
        }, {});

        const teiAttributesValues = attributes.reduce((acc, item) => {
            acc[item.attribute] = convertValue(item.value, item.valueType);
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
