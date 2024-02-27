// @flow
import { hasAPISupportForFeature } from './support';

let minorVersion = '';

export const initFeatureAvailability = (serverVersion: { minor: string }) => {
    minorVersion = serverVersion.minor;
};

export const featureAvailable = (featureName: string) =>
    hasAPISupportForFeature(minorVersion, featureName);
