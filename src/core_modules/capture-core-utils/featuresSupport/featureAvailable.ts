import { hasAPISupportForFeature } from './support';
import type { Feature } from './support';

let minorVersion: number = 0;

export const initFeatureAvailability = (serverVersion: { minor: number }): void => {
    minorVersion = serverVersion.minor;
};

export const featureAvailable = (featureName: Feature): boolean =>
    hasAPISupportForFeature(minorVersion, featureName);
