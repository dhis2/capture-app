// @flow
import React, { useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    getEventProgramThrowIfNotFound,
} from '../../../../../metaData';
import { convertClientToList } from '../../../../../converters';
import { EventWorkingListsTemplateSetup } from '../TemplateSetup';
import type { ColumnConfig } from '../../WorkingLists';
import type { EventsMainProperties, EventsDataElementValues } from '../types';

type Props = {
    eventsMainProperties: EventsMainProperties,
    eventsDataElementValues: EventsDataElementValues,
    defaultConfig: Map<string, ColumnConfig>,
};

export const EventWorkingListsDataSourceSetup = (props: Props) => {
    const { eventsMainProperties, eventsDataElementValues, defaultConfig, ...passOnProps } = props;

    const dataSource = useMemo(() => {
        if (!eventsMainProperties || Object.keys(eventsMainProperties).length <= 0) {
            return {};
        }

        // $FlowFixMe
        const programId = Object.values(eventsMainProperties)[0].programId;
        const stageForm = getEventProgramThrowIfNotFound(programId).stage.stageForm;

        return Object
            .keys(eventsMainProperties)
            .map(key => ({
                eventMainProperties: eventsMainProperties[key],
                eventDataElementValues: eventsDataElementValues[key],
            }))
            .reduce((accDataSource, { eventMainProperties, eventDataElementValues }) => {
                const convertedDataElementValues = stageForm.convertValues(eventDataElementValues, convertClientToList);
                const convertedMainProperties = [...defaultConfig.values()]
                    .filter(column => column.isMainProperty)
                    .reduce((acc, mainColumn) => {
                        const sourceValue = eventMainProperties[mainColumn.id];
                        if (sourceValue != null) {
                            if (mainColumn.options) {
                                // TODO: Need is equal comparer for types because `sourceValue` and `option` can be an object for example (for some data element types) and we can't do strict comparison.
                                const option = mainColumn.options.find(o => o.value === sourceValue);
                                if (!option) {
                                    log.error(
                                        errorCreator(
                                            'Missing value in options for main event property')(
                                            { sourceValue, mainColumn }),
                                    );
                                } else {
                                    acc[mainColumn.id] = option.text;
                                }
                            } else {
                                acc[mainColumn.id] = convertClientToList(sourceValue, mainColumn.type);
                            }
                        }
                        return acc;
                    }, {});

                accDataSource[eventMainProperties.eventId] = {
                    ...convertedDataElementValues,
                    ...convertedMainProperties,
                    eventId: eventMainProperties.eventId, // used as rowkey
                };
                return accDataSource;
            }, {});
    }, [
        eventsMainProperties,
        eventsDataElementValues,
        defaultConfig,
    ]);

    return (
        <EventWorkingListsTemplateSetup
            {...passOnProps}
            defaultConfig={defaultConfig}
            dataSource={dataSource}
            rowIdKey="eventId"
        />
    );
};
