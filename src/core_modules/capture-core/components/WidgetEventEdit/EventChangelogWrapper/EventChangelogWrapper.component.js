// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { DataElement } from '../../../metaData';
import { dataElementTypes } from '../../../metaData';
import type { Props } from './EventChangelogWrapper.types';
import { WidgetEventChangelog } from '../../WidgetsChangelog';

export const EventChangelogWrapper = ({ formFoundation, eventId, eventData, ...passOnProps }: Props) => {
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
                type: dataElementTypes.DATETIME,
            };

            return acc;
        }, {});

        const additionalFields = formFoundation.featureType !== 'None' ? {
            geometry: {
                id: 'geometry',
                name: formFoundation.featureType === 'Polygon' ? i18n.t('Area') : i18n.t('Coordinate'),
                type: formFoundation.featureType === 'Polygon' ?
                    dataElementTypes.POLYGON : dataElementTypes.COORDINATE,
            },
        } : null;

        return {
            ...fieldElementsById,
            ...fieldElementsContext,
            ...additionalFields,
        };
    }, [formFoundation]);

    return (
        <WidgetEventChangelog
            {...passOnProps}
            eventId={eventId}
            eventData={eventData}
            dataItemDefinitions={dataItemDefinitions}
        />
    );
};
