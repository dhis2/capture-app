// @flow
import { hasAPISupportForFeature } from './support';

let minorVersion = '';

export const initFeatureAvailability = (serverVersion: { minor: number }) => {
    minorVersion = serverVersion.minor;
};

export const featureAvailable = (featureName: string) =>
    hasAPISupportForFeature(minorVersion, featureName);
