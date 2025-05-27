// @flow
import type { ServerVersion, AdapterTypes } from './types';

export type Input = {|
    adapterTypes: AdapterTypes,
    onCacheExpired: Function,
    serverVersion: ServerVersion,
    baseUrl: string,
|};
