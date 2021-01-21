// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { typeof dataElementTypes } from '../../../../../metaData';
import { convertClientToList } from '../../../../../converters';
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
                .reduce((acc, { id, options, type }) => {
                    const clientValue = eventRecord[id];

                    if (options) {
                        // TODO: Need is equal comparer for types because `sourceValue` and `option` can be an object for example (for some data element types) and we can't do strict comparison.
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
                id: eventRecord.id, // used as rowkey
            };
        }), [
        eventRecordsArray,
        columns,
    ]);
};
