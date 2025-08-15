import type { ServerVersion, AdapterTypes } from './types';

export type Input = {
    adapterTypes: AdapterTypes;
    onCacheExpired: any;
    serverVersion: ServerVersion;
    baseUrl: string;
};
