// @flow
import React, { useMemo } from 'react';
import { EventChangelog } from '../../WidgetsChangelog/EventChangelog';
import type { DataElement } from '../../../metaData';
import { dataElementTypes } from '../../../metaData';
import type { Props } from './EventChangelogWrapper.types';

export const EventChangelogWrapperComponent = ({ formFoundation, ...passOnProps }: Props) => {
    const {
        dataItemDefinitions,
        metadataItemDefinitions,
    } = useMemo(() => {
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
                    code: option.code,
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
            dataItemDefinitions: fieldElementsById,
            metadataItemDefinitions: fieldElementsContext,
        };
    }, [formFoundation]);

    return (
        <EventChangelog
            {...passOnProps}
            dataItemDefinitions={dataItemDefinitions}
            metadataItemDefinitions={metadataItemDefinitions}
        />
    );
};
