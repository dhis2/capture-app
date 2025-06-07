import { useMemo } from 'react';
import { convertValue } from '../../../../converters/serverToClient';
import { dataElementTypes } from '../../../../metaData';
import { useOrgUnitNames } from '../../../../metadataRetrieval/orgUnitName';

const convertDate = (date: any) => convertValue(date, dataElementTypes.DATE);

const getClientFormattedDataValuesAsObject = (dataValues: any, elementsById: any) =>
    dataValues.reduce((acc: any, { dataElement: id, value }: any) => {
        const dataElement = elementsById[id];
        if (dataElement) {
            acc[id] = convertValue(value, dataElement.valueType);
        }
        return acc;
    }, {});

const getOrgUnitIds = (enrollment: any): Array<string> =>
    (enrollment ? enrollment.events.reduce((acc: Array<string>, event: any) => {
        if (event.orgUnit) {
            acc.push(event.orgUnit);
        }
        return acc;
    }, []) : []);

export const useEvents = (enrollment: any, elementsById: any) => {
    const orgUnitIds = useMemo(() => getOrgUnitIds(enrollment), [enrollment]);
    const { orgUnitNames } = useOrgUnitNames(orgUnitIds);
    return useMemo(
        () =>
            enrollment && orgUnitNames &&
            enrollment.events.map((event: any) => ({
                eventId: event.event,
                programId: event.program,
                programStageId: event.programStage,
                orgUnitId: event.orgUnit,
                orgUnitName: orgUnitNames[event.orgUnit],
                trackedEntityInstanceId: event.trackedEntity,
                enrollmentId: event.enrollment,
                enrollmentStatus: event.enrollmentStatus,
                status: event.status,
                occurredAt: convertDate(event.occurredAt),
                scheduledAt: convertDate(event.scheduledAt),
                ...getClientFormattedDataValuesAsObject(event.dataValues, elementsById),
            })),
        [elementsById, enrollment, orgUnitNames],
    );
};
