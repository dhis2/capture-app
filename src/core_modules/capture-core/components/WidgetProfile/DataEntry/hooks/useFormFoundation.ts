import { useState, useEffect } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { buildFormFoundation } from '../FormFoundation';
import type { DataEntryFormConfig } from '../../../DataEntries/common/TEIAndEnrollment';

export const useFormFoundation = (programAPI: any, dataEntryFormConfig: DataEntryFormConfig | null) => {
    const [formFoundation, setFormFoundation] = useState<any>({});
    const dataEngine = useDataEngine();

    useEffect(() => {
        const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
        buildFormFoundation(
            programAPI,
            setFormFoundation,
            querySingleResource,
            dataEntryFormConfig,
        );
    }, [programAPI, dataEngine, dataEntryFormConfig]);

    return formFoundation;
};
