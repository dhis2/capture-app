import { useCallback } from 'react';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';
import { useNavigate, useLocationQuery, buildUrlQueryString } from '../../../../utils/routing';

export const useLinkedRecordClick = () => {
    const { navigate } = useNavigate();
    const { orgUnitId } = useLocationQuery();

    const onLinkedRecordClick = useCallback((navigationArgs: any) => {
        let url;
        if (navigationArgs.eventId) {
            const { eventId, programId } = navigationArgs;
            const recordProgram = getProgramFromProgramIdThrowIfNotFound(programId);
            if (recordProgram instanceof EventProgram) {
                url = `/viewEvent?viewEventId=${eventId}`;
            } else {
                url = `/enrollmentEventEdit?${buildUrlQueryString({
                    orgUnitId,
                    eventId,
                })}`;
            }
        } else if (navigationArgs.trackedEntityId) {
            const { trackedEntityId, programId } = navigationArgs;
            url = `/enrollment?${buildUrlQueryString({
                programId,
                orgUnitId,
                teiId: trackedEntityId,
                enrollmentId: 'AUTO',
            })}`;
        }

        if (url) {
            navigate(url);
        }
    }, [navigate, orgUnitId]);

    return {
        onLinkedRecordClick,
    };
};
