import React, { useMemo } from 'react';
import { dataElementTypes, RenderFoundation, type DataElement } from '../../../../metaData';
import { useFormFoundation } from '../../DataEntry/hooks';
import { WidgetTrackedEntityChangelog } from '../../../WidgetsChangelog';
import type { TrackedEntityChangelogWrapperProps } from '../types/overflowMenu.types';

export const TrackedEntityChangelogWrapper = ({ programAPI, teiId, setIsOpen, trackedEntityData, ...passOnProps }: TrackedEntityChangelogWrapperProps) => {
    const formFoundation: RenderFoundation = useFormFoundation(programAPI);

    const transformedTrackedEntityData = useMemo(() => {
        if (!Array.isArray(trackedEntityData)) return {};
        return trackedEntityData.reduce((acc: Record<string, unknown>, item: any) => {
            acc[item.attribute] = item.value;
            return acc;
        }, {});
    }, [trackedEntityData]);

    const dataItemDefinitions = useMemo(() => {
        if (!Object.keys(formFoundation)?.length) return {};
        const elements = formFoundation.getElements();
        const contextLabels = formFoundation.getLabels();

        const fieldElementsById = elements.reduce((acc: Record<string, any>, element: DataElement) => {
            if (!transformedTrackedEntityData.hasOwnProperty(element.id)) {
                return acc;
            }

            const { optionSet } = element;
            const metadata: {
                id: string;
                name: string;
                type: string;
                optionSet?: string;
                options?: Array<{ code: string; name: string }>;
            } = {
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

        const fieldElementsContext = Object.keys(contextLabels).reduce((acc: Record<string, any>, key) => {
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
    }, [formFoundation, transformedTrackedEntityData]);

    return (
        <WidgetTrackedEntityChangelog
            {...passOnProps}
            teiId={teiId}
            close={() => setIsOpen(false)}
            programId={programAPI.id}
            dataItemDefinitions={dataItemDefinitions}
            trackedEntityData={transformedTrackedEntityData}
        />
    );
};
