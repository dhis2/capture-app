import { useMemo } from 'react';
import { convertValue } from '../../../../converters/serverToClient';
import { dataElementTypes } from '../../../../metaData';
import { useOrgUnitNames } from '../../../../metadataRetrieval/orgUnitName';

const convertDate = (date: string) => convertValue(date, dataElementTypes.DATE);

type DataValue = {
    dataElement: string;
    value: string;
};

const getClientFormattedDataValuesAsObject = (dataValues: DataValue[], elementsById: Record<string, any>) =>
    dataValues.reduce((acc, { dataElement: id, value }) => {
        const dataElement = elementsById[id];
        if (dataElement) {
            acc[id] = convertValue(value, dataElement.valueType);
        }
        return acc;
    }, {} as Record<string, any>);

const getOrgUnitIds = (enrollment: any): Array<string> =>
    (enrollment ? enrollment.events.reduce((acc: string[], event) => {
        if (event.orgUnit) {
            acc.push(event.orgUnit);
        }
        return acc;
    }, []) : []);

export const useEvents = (enrollment: any, elementsById: Record<string, any>) => {
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
