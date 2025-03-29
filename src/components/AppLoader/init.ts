import { QuerySingleResource } from '../../types/global.types';

export async function initializeAsync(
    onCacheExpired: () => void,
    querySingleResource: QuerySingleResource,
    minorServerVersion: number,
): Promise<void> {
    return Promise.resolve();
}
