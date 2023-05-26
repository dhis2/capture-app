// @flow

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import log from 'loglevel';
import type { UrlParameters } from '../../../WidgetsRelationship/common/Types';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';
import { buildUrlQueryString } from '../../../../utils/routing';
import { errorCreator } from '../../../../../capture-core-utils';

export const useLinkedRecordClick = () => {
    const history = useHistory();

    const onLinkedRecordClick = useCallback((urlParameters: UrlParameters) => {
        let url;
        const {
            programId,
            orgUnitId,
            eventId,
            teiId,
        } = urlParameters;

        if (!programId || !orgUnitId) {
            log.error(errorCreator('programId and orgUnitId must be provided')({ programId, orgUnitId }));
            return;
        }

        if (eventId) {
            const recordProgram = getProgramFromProgramIdThrowIfNotFound(programId);
            if (recordProgram instanceof EventProgram) {
                url = `/viewEvent?viewEventId=${eventId}`;
            } else {
                url = `/enrollmentEventEdit?${buildUrlQueryString({
                    orgUnitId,
                    eventId,
                })}`;
            }
        } else if (teiId) {
            url = `/enrollment?${buildUrlQueryString({
                programId,
                orgUnitId,
                teiId,
                enrollmentId: 'AUTO',
            })}`;
        }

        if (url) {
            history.push(url);
        }
    }, [history]);

    return {
        onLinkedRecordClick,
    };
};
