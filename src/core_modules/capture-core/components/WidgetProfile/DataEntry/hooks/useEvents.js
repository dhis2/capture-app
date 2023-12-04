// @flow
import { useMemo } from 'react';
import { convertValue } from '../../../../converters/serverToClient';
import { dataElementTypes } from '../../../../metaData';
import { useOrgUnitNames } from '../../../../metadataRetrieval/orgUnitName';

const convertDate = date => convertValue(date, dataElementTypes.DATE);

const getClientFormattedDataValuesAsObject = (dataValues, elementsById) =>
    dataValues.reduce((acc, { dataElement: id, value }) => {
        const dataElement = elementsById[id];
        if (dataElement) {
            acc[id] = convertValue(value, elementsById[id].type);
        }
        return acc;
    }, {});

const getOrgUnitIds = (enrollment: any): Array<string> =>
    (enrollment ? enrollment.events.reduce((acc, event) => {
        if (event.orgUnit) {
            acc.push(event.orgUnit);
        }
        return acc;
    }, []) : []);

export const useEvents = (enrollment: any, elementsById: Array<any>) => {
    const orgUnitIds = useMemo(() => getOrgUnitIds(enrollment), [enrollment]);
    const { orgUnitNames } = useOrgUnitNames(orgUnitIds);
    return useMemo(
        () =>
            enrollment && orgUnitNames &&
            enrollment.events.map(event => ({
                eventId: event.event,
                programId: event.program,
                programStageId: event.programStage,
                orgUnitId: event.orgUnit,
                orgUnitName: orgUnitNames[event.orgUnit],
                trackedEntityInstanceId: event.trackedEntity,
                enrollmentId: event.enrollment,
                enrollmentStatus: event.enrollmentStatus,
                status: event.status,
                eventDate: convertDate(event.eventDate),
                dueDate: convertDate(event.dueDate),
                ...getClientFormattedDataValuesAsObject(event.dataValues, elementsById),
            })),
        [elementsById, enrollment, orgUnitNames],
    );
};
