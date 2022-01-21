// @flow
import { useMemo } from 'react';
import { convertValue } from '../../../../converters/serverToClient';
import { dataElementTypes } from '../../../../metaData';

const convertDate = date => convertValue(date, dataElementTypes.DATE);

const getClientFormattedDataValuesAsObject = (dataValues, elementsById) =>
    dataValues.reduce((acc, { dataElement: id, value }) => {
        const dataElement = elementsById[id];
        if (dataElement) {
            acc[id] = convertValue(value, elementsById[id].type);
        }
        return acc;
    }, {});

export const useEvents = (enrollment: any, elementsById: Array<any>) =>
    useMemo(
        () =>
            enrollment &&
            enrollment.events.map(event => ({
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
                ...getClientFormattedDataValuesAsObject(event.dataValues, elementsById),
            })),
        [elementsById, enrollment],
    );
