import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export type AttributeOptionComboCategoryOption = {
    id: string;
    displayName: string;
    categories: Array<{ id: string; displayName: string }>;
};

export type AttributeOptionComboDetails = {
    id: string;
    displayName: string;
    categoryCombo: { id: string; isDefault: boolean };
    categoryOptions: Array<AttributeOptionComboCategoryOption>;
};

export const useAttributeOptionComboDetails = (attributeOptionCombo?: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                attributeOptionCombo: {
                    resource: 'categoryOptionCombos',
                    id: ({ variables }: any) => variables.attributeOptionCombo,
                    params: {
                        fields: 'id,displayName,categoryCombo[id,isDefault],' +
                            'categoryOptions[id,displayName,categories[id,displayName]]',
                    },
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        if (attributeOptionCombo) {
            refetch({ variables: { attributeOptionCombo } });
        }
    }, [refetch, attributeOptionCombo]);

    return {
        error,
        loading,
        attributeOptionComboDetails: attributeOptionCombo
            ? (data?.attributeOptionCombo as AttributeOptionComboDetails | undefined)
            : undefined,
    };
};
