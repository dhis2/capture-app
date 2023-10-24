// @flow
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import type { NavigationArgs } from '../../../WidgetsRelationship/WidgetTrackedEntityRelationship';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';
import { useLocationQuery, buildUrlQueryString } from '../../../../utils/routing';

export const useLinkedRecordClick = () => {
    const history = useHistory();
    const { orgUnitId } = useLocationQuery();

    const onLinkedRecordClick = useCallback((navigationArgs: NavigationArgs) => {
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
            history.push(url);
        }
    }, [history, orgUnitId]);

    return {
        onLinkedRecordClick,
    };
};
