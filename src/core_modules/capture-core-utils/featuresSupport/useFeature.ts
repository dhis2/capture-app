// @flow
import { useMemo } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { hasAPISupportForFeature } from './support';
import type { Feature } from './support';

export const useFeature = (featureName: Feature): boolean => {
    const {
        serverVersion: { minor: minorVersion },
    } = useConfig();
    return useMemo(() => hasAPISupportForFeature(minorVersion, featureName), [minorVersion, featureName]);
};
