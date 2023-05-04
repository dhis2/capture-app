// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes, DataElement, OptionSet, Option } from '../../../../metaData';
import { convertClientToList } from '../../../../converters';
import type { DataSource } from '../../WorkingListsBase';

const createDataElement = (column) => {
    const dataElement = new DataElement((o) => {
        o.id = column.id;
        o.type = column.type;
    });

    if (column.options) {
        const options = column.options.map(option =>
            new Option((o) => {
                o.text = option.text;
                o.value = option.value;
            }),
        );
        const optionSet = new OptionSet(column.id, options, null, dataElement);
        dataElement.optionSet = optionSet;
    }
    return dataElement;
};

export const useDataSource = (
    records?: { [string]: any },
    recordsOrder?: Array<string>,
    columns: Array<{
        id: string,
        options?: ?Array<{ text: string, value: any }>,
        type: $Values<typeof dataElementTypes>,
        visible: boolean,
        [string]: any,
    }>,
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
                .reduce((acc, column) => {
                    const { id, type, options, resolveValue } = column;
                    const clientValue = eventRecord[id];
                    if (resolveValue) {
                        acc[id] = resolveValue()[clientValue];
                    } else if (options) {
                        if (type === dataElementTypes.MULTI_TEXT) {
                            const dataElement = createDataElement(column);
                            acc[id] = convertClientToList(clientValue, type, dataElement);
                        } else {
                            // TODO: Need is equal comparer for types because `sourceValue` and `option` can be an object for example (for some data element types) and we can't do strict comparison.
                            const option = options.find(o => o.value === clientValue);
                            if (!option) {
                                log.error(
                                    errorCreator(
                                        'Missing value in options')(
                                        { id, clientValue, options }),
                                );
                                acc[id] = convertClientToList(clientValue, type);
                            } else {
                                acc[id] = option.text;
                            }
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
