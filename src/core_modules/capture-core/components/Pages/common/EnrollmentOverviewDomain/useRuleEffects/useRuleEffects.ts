import { useEffect, useMemo, useState } from 'react';
import { convertValue } from '../../../../../converters/serverToClient';
import { getApplicableRuleEffectsForTrackerProgram } from '../../../../../rules';
import { dataElementTypes, getTrackerProgramThrowIfNotFound, type TrackerProgram } from '../../../../../metaData';
import type { UseRuleEffectsInput } from './useRuleEffects.types';

const convertDate = (date: string): string => convertValue(date, dataElementTypes.DATE);

const getDataElementsInProgram = (program: TrackerProgram) =>
    [...program.stages.values()]
        .reduce((acc, { stageForm }: any) => ({
            ...acc,
            ...stageForm.getElementsById(),
        }), {});

const getClientFormattedDataValuesAsObject = (dataValues: any, elementsById: any) =>
    dataValues.reduce((acc: any, { dataElement: id, value }: any) => {
        const dataElement = elementsById[id];
        if (dataElement) {
            acc[id] = convertValue(value, elementsById[id].type);
        }
        return acc;
    }, {});

const useEventsData = (enrollment: any, program: TrackerProgram) => {
    const elementsById = useMemo(() => getDataElementsInProgram(program), [program]);

    return useMemo(() => enrollment && enrollment.events.map((event: any) => ({
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

const useEnrollmentData = (enrollment: any) => useMemo(() => {
    if (!enrollment) {
        return undefined;
    }

    const { enrollment: enrollmentId, enrolledAt, occurredAt, status, program } = enrollment;

    return {
        enrolledAt: convertDate(enrolledAt),
        occurredAt: occurredAt ? convertDate(occurredAt) : undefined,
        enrollmentId,
        enrollmentStatus: status,
        programName: getTrackerProgramThrowIfNotFound(program).name,
    };
}, [enrollment]);

export const useRuleEffects = ({
    orgUnit,
    program,
    apiEnrollment,
    apiAttributeValues,
    executionEnvironment,
}: UseRuleEffectsInput) => {
    const [ruleEffects, setRuleEffects] = useState<any>(undefined);
    const attributesObject = useMemo(() =>
        program.attributes.reduce((acc: any, attribute: any) => {
            acc[attribute.id] = attribute;
            return acc;
        }, {}), [program.attributes]);

    const attributeValues = useMemo(() => apiAttributeValues &&
        apiAttributeValues
            .reduce((acc: any, { id, value }) => {
                acc[id] = convertValue(value, attributesObject[id]?.type);
                return acc;
            }, {}), [apiAttributeValues, attributesObject]);

    const enrollmentData = useEnrollmentData(apiEnrollment);

    const otherEvents = useEventsData(apiEnrollment, program);

    useEffect(() => {
        if (orgUnit && attributeValues && enrollmentData && otherEvents) {
            getApplicableRuleEffectsForTrackerProgram({
                program,
                orgUnit,
                otherEvents,
                attributeValues,
                enrollmentData,
                executionEnvironment,
            }, true).then((effects) => {
                if (Array.isArray(effects)) {
                    setRuleEffects(effects);
                }
            }).catch(error => console.log(error));
        }
    }, [
        attributeValues,
        enrollmentData,
        orgUnit,
        otherEvents,
        program,
        executionEnvironment,
    ]);

    return ruleEffects;
};
