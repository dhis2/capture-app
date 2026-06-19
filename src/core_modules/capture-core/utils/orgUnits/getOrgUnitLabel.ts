import { programCollection } from 'capture-core/metaDataMemoryStores';
import { getProgramLabel } from 'capture-core/metaData';

/**
 * Resolves the program's configured custom "organisation unit" label (DHIS2-16610), or undefined
 * when none is set — letting callers fall back to the default term. Non-hook, so it can be used
 * from form validators that run outside React render.
 */
export const getOrgUnitLabel = (programId?: string | null): string | undefined =>
    getProgramLabel(programId ? programCollection.get(programId) : undefined, 'orgUnit');
