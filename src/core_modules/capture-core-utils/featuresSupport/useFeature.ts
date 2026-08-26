import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { hasAPISupportForFeature } from './support';

export const useFeature = (featureName: string) => {
    const {
        serverVersion: { minor: minorVersion } = { minor: 0 },
    } = useConfig();
    return useMemo(() => hasAPISupportForFeature(minorVersion, featureName), [minorVersion, featureName]);
};
