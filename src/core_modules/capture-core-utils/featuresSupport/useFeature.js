// @flow
import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { hasAPISupportForFeature } from './support';

export const useFeature = (featureName: string) => {
    const {
        serverVersion: { minor: minorVersion },
    } = useConfig();
    return useMemo(() => hasAPISupportForFeature(minorVersion, featureName), [minorVersion, featureName]);
};
