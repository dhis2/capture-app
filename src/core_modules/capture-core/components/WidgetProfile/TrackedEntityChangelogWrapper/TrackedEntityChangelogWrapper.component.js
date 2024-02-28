// @flow
import React, { useMemo } from 'react';
import { dataElementTypes, RenderFoundation } from '../../../metaData';
import { useFormFoundation } from '../DataEntry/hooks';
import type { DataElement } from '../../../metaData';
import type { Props } from './TrackedEntityChangelogWrapper.types';
import { Changelog, CHANGELOG_ENTITY_TYPES } from '../../WidgetsChangelog';

export const TrackedEntityChangelogWrapper = ({ programAPI, teiId, ...passOnProps }: Props) => {
    const formFoundation: RenderFoundation = useFormFoundation(programAPI);

    const {
        dataItemDefinitions,
        metadataItemDefinitions,
    } = useMemo(() => {
        if (!Object.keys(formFoundation)?.length) return {};
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
        <Changelog
            {...passOnProps}
            entityType={CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY}
            entityId={teiId}
            dataItemDefinitions={dataItemDefinitions}
            metadataItemDefinitions={metadataItemDefinitions}
        />
    );
};
