// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { typeof dataElementTypes } from '../../../metaData';
import { convertClientToList } from '../../../converters';
import type { DataSource } from '../../WorkingLists';

export const useDataSource = (
    records?: { [string]: any },
    recordsOrder?: Array<string>,
    columns: Array<{ id: string, options?: ?Array<{text: string, value: any}>, type: $Values<dataElementTypes>, visible: boolean, [string]: any }>,
): DataSource | void => {
    const eventRecordsArray = useMemo(() =>
        recordsOrder && records && recordsOrder
            .map(id => ({
                ...records[id],
                id,
            })), [
        records,
        recordsOrder,
    ]);

    return useMemo(() => eventRecordsArray && eventRecordsArray
        .map((eventRecord) => {
            const listRecord = columns
                .filter(column => column.visible)
                .reduce((acc, { id, type, resolveValue }) => {
                    const clientValue = eventRecord[id];
                    if (resolveValue) {
                        acc[id] = resolveValue()[clientValue];
                    } else {
                        acc[id] = convertClientToList(clientValue, type);
                    }
                    return acc;
                }, {});

            return {
                ...listRecord,
                id: eventRecord.id, // used as rowkey
            };
        }), [
        eventRecordsArray,
        columns,
    ]);
};
