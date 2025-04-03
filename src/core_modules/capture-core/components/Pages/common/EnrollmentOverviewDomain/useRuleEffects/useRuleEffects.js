// @flow
import { useEffect, useMemo, useState } from 'react';
import { convertValue } from '../../../../../converters/serverToClient';
import { getApplicableRuleEffectsForTrackerProgram } from '../../../../../rules';
import { dataElementTypes, type TrackerProgram } from '../../../../../metaData';
import type { UseRuleEffectsInput } from './useRuleEffects.types';

// $FlowFixMe
const convertDate = (date: string): string => convertValue(date, dataElementTypes.DATE);

const getDataElementsInProgram = (program: TrackerProgram) =>
    [...program.stages.values()]
        // $FlowFixMe
        .reduce((acc, { stageForm }) => ({
            ...acc,
            ...stageForm.getElementsById(),
        }), {});

const getClientFormattedDataValuesAsObject = (dataValues, elementsById) =>
    dataValues.reduce((acc, { dataElement: id, value }) => {
        const dataElement = elementsById[id];
        if (dataElement) {
            acc[id] = convertValue(value, elementsById[id].type);
        }
        return acc;
    }, {});

const useEventsData = (enrollment, program) => {
    const elementsById = useMemo(() => getDataElementsInProgram(program), [program]);

    return useMemo(() => enrollment && enrollment.events.map(event => ({
        eventId: event.event,
        programId: event.program,
        programStageId: event.programStage,
        orgUnitId: event.orgUnit,
        trackedEntityInstanceId: event.trackedEntity,
        enrollmentId: event.enrollment,
        enrollmentStatus: event.enrollmentStatus,
        status: event.status,
        occurredAt: convertDate(event.occurredAt),
        scheduledAt: convertDate(event.scheduledAt),
        ...getClientFormattedDataValuesAsObject(event.dataValues, elementsById),
    })), [elementsById, enrollment]);
};

const useEnrollmentData = enrollment => useMemo(() => {
    if (!enrollment) {
        return undefined;
    }

    const { enrollment: enrollmentId, enrolledAt, occurredAt } = enrollment;

    return {
        enrolledAt: convertDate(enrolledAt),
        occurredAt: occurredAt ? convertDate(occurredAt) : undefined,
        enrollmentId,
    };
}, [enrollment]);

export const useRuleEffects = ({ orgUnit, program, apiEnrollment, apiAttributeValues }: UseRuleEffectsInput) => {
    const [ruleEffects, setRuleEffects] = useState(undefined);
    const attributesObject = useMemo(() =>
        program.attributes.reduce((acc, attribute) => {
            acc[attribute.id] = attribute;
            return acc;
        }, {}), [program.attributes]);

    const attributeValues = useMemo(() => apiAttributeValues &&
        apiAttributeValues
            .reduce((acc, { id, value }) => {
                acc[id] = convertValue(value, attributesObject[id]?.type);
                return acc;
            }, {}), [apiAttributeValues, attributesObject]);

    const enrollmentData = useEnrollmentData(apiEnrollment);

    const otherEvents = useEventsData(apiEnrollment, program);

    useEffect(() => {
        if (orgUnit && attributeValues && enrollmentData && otherEvents) {
            const effects = getApplicableRuleEffectsForTrackerProgram({
                program,
                orgUnit,
                otherEvents,
                attributeValues,
                enrollmentData,
            }, true);
            if (Array.isArray(effects)) {
                setRuleEffects(effects);
            }
        }
    }, [attributeValues, enrollmentData, orgUnit, otherEvents, program]);

    return ruleEffects;
};
