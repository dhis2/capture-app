// @flow
/* eslint-disable complexity */
import { isNumber, isObject } from 'lodash';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useEffect } from 'react';
import { useApiMetadataQuery } from '../../../../../utils/reactQueryHelpers';
import type { WorkingListsEvents, UseMainViewConfig } from './useMainViewConfig.types';

export const useMainViewConfig: UseMainViewConfig = () => {
    const { data: mainViewConfig, isLoading, isError, error } = useApiMetadataQuery<any>(
        ['dataStore', 'workingListsEvents'], {
            resource: 'dataStore/capture/workingListsEvents',
        }, {
            select: (workingListsEvents: WorkingListsEvents) => {
                // only adding support for relative event date as of now
                // we should use Zod here long-term to properly validate the structure of the object
                const occurredAt = workingListsEvents?.mainView?.occurredAt;
                if (
                    !occurredAt ||
                    !isObject(occurredAt) ||
                    occurredAt.type !== 'RELATIVE'
                ) {
                    return undefined;
                }

                // The general idea is that the return value here should have the same data structure
                // as the response from the working lists api
                if (occurredAt.period) {
                    if (['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR', 'LAST_WEEK', 'LAST_MONTH', 'LAST_3_MONTHS']
                        .includes(occurredAt.period)
                    ) {
                        return {
                            eventDate: {
                                type: occurredAt.type,
                                period: occurredAt.period,
                                startBuffer: 0,
                                endBuffer: 0,
                            },
                        };
                    }
                } else {
                    if ((occurredAt.startBuffer && !isNumber(occurredAt.startBuffer)) ||
                        (occurredAt.endBuffer && !isNumber(occurredAt.endBuffer)) ||
                        (!occurredAt.startBuffer && !occurredAt.endBuffer)) {
                        return undefined;
                    }
                    return {
                        eventDate: {
                            type: occurredAt.type,
                            startBuffer: occurredAt.startBuffer,
                            endBuffer: occurredAt.endBuffer,
                        },
                    };
                }
                return undefined;
            },
        },
    );

    useEffect(() => {
        if (isError) {
            log.error(
                errorCreator(
                    'workingListEvents could not be fetched from the datastore')({ error }),
            );
        }
    }, [isError, error]);

    return {
        mainViewConfig,
        mainViewConfigReady: !isLoading,
    };
};
