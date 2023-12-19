// @flow
import { useState, useEffect } from 'react';
import { useDataEngine, useConfig } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { buildFormFoundation } from '../FormFoundation';

export const useFormFoundation = (programAPI: any) => {
    const [formFoundation, setFormFoundation] = useState<any>({});
    const dataEngine = useDataEngine();
    const { serverVersion: { minor: minorServerVersion } } = useConfig();

    useEffect(() => {
        const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
        buildFormFoundation(programAPI, setFormFoundation, querySingleResource, minorServerVersion);
    }, [programAPI, dataEngine, minorServerVersion]);

    return formFoundation;
};
