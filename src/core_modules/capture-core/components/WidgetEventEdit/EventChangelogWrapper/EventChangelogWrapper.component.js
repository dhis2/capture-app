// @flow
import React, { useMemo } from 'react';
import type { DataElement } from '../../../metaData';
import { dataElementTypes } from '../../../metaData';
import type { Props } from './EventChangelogWrapper.types';
import { WidgetEventChangelog } from '../../WidgetsChangelog';

export const EventChangelogWrapper = ({ formFoundation, eventId, ...passOnProps }: Props) => {
    const dataItemDefinitions = useMemo(() => {
        const elements = formFoundation.getElements();
        const contextLabels = formFoundation.getLabels();

        const fieldElementsById = elements.reduce((acc, element: DataElement) => {
            const { optionSet } = element;
            const metadata = {
                id: element.id,
                name: element.formName,
                type: element.type,
                optionSet: undefined,
                options: undefined,
            };

            if (optionSet && optionSet.options) {
                metadata.optionSet = optionSet.id;
                metadata.options = optionSet.options.map(option => ({
                    code: option.value,
                    name: option.text,
                }));
            }

            acc[element.id] = metadata;
            return acc;
        }, {});

        const fieldElementsContext = Object.keys(contextLabels).reduce((acc, key) => {
            acc[key] = {
                id: key,
                name: contextLabels[key],
                type: dataElementTypes.DATE,
            };

            return acc;
        }, {});

        return {
            ...fieldElementsById,
            ...fieldElementsContext,
        };
    }, [formFoundation]);

    return (
        <WidgetEventChangelog
            {...passOnProps}
            eventId={eventId}
            dataItemDefinitions={dataItemDefinitions}
        />
    );
};
