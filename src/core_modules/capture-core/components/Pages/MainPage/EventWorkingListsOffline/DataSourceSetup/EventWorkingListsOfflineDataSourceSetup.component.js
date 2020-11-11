// @flow
import React, { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { createOfflineListWrapper } from '../../../../List'; // TODO: Refactor list
import { convertClientToList } from '../../../../../converters';
import type { Props } from './eventWorkingListsOfflineDataSourceSetup.types';

const OfflineListWrapper = createOfflineListWrapper();

export const EventWorkingListsOfflineDataSourceSetup = ({
    eventRecords,
    columns,
    recordsOrder,
    ...passOnProps
}: Props) => {
    const hasData = !!recordsOrder;
    const eventRecordsArray = useMemo(() =>
        recordsOrder && eventRecords && recordsOrder
            .map(eventId => ({
                ...eventRecords[eventId],
                eventId,
            })), [
        eventRecords,
        recordsOrder,
    ]);

    const dataSource = useMemo(() => eventRecordsArray && eventRecordsArray
        .map((eventRecord) => {
            const listRecord = columns
                .reduce((acc, { id, options, type }) => {
                    const clientValue = eventRecord[id];

                    if (options) {
                        // TODO: Need is equal comparer for types
                        const option = options.find(o => o.value === clientValue);
                        if (!option) {
                            log.error(
                                errorCreator(
                                    'Missing value in options')(
                                    { id, clientValue, options }),
                            );
                        } else {
                            acc[id] = option.text;
                        }
                    } else {
                        acc[id] = convertClientToList(clientValue, type);
                    }
                    return acc;
                }, {});

            return {
                ...listRecord,
                eventId: eventRecord.eventId, // used as rowkey
            };
        }), [
        eventRecordsArray,
        columns,
    ]);

    return (
        <OfflineListWrapper
            {...passOnProps}
            hasData={hasData}
            dataSource={dataSource}
            columns={columns}
            rowIdKey="eventId"
        />
    );
};
