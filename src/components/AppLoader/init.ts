import { QuerySingleResource } from '../../types/global.types';

export async function initializeAsync(
    _onCacheExpired: () => void,
    _querySingleResource: QuerySingleResource,
    _minorServerVersion: number,
): Promise<void> {
    return Promise.resolve();
}
