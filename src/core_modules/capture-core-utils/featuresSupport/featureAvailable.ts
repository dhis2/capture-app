import { hasAPISupportForFeature } from './support';

let minorVersion: string | number = '';

export const initFeatureAvailability = (serverVersion?: { minor: number }) => {
    if (serverVersion) {
        minorVersion = serverVersion.minor;
    }
};

export const featureAvailable = (featureName: string) =>
    hasAPISupportForFeature(minorVersion, featureName);
