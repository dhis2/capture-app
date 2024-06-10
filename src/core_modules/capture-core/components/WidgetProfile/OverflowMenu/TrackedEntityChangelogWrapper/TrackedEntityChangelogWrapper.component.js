// @flow
import React, { useMemo } from 'react';
import { dataElementTypes, RenderFoundation, type DataElement } from '../../../../metaData';
import { useFormFoundation } from '../../DataEntry/hooks';
import { WidgetTrackedEntityChangelog } from '../../../WidgetsChangelog';
import type { Props } from './TrackedEntityChangelogWrapper.types';

export const TrackedEntityChangelogWrapper = ({ programAPI, teiId, setIsOpen, ...passOnProps }: Props) => {
    const formFoundation: RenderFoundation = useFormFoundation(programAPI);

    const dataItemDefinitions = useMemo(() => {
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
        <WidgetTrackedEntityChangelog
            {...passOnProps}
            teiId={teiId}
            close={() => setIsOpen(false)}
            programId={programAPI.id}
            dataItemDefinitions={dataItemDefinitions}
        />
    );
};
