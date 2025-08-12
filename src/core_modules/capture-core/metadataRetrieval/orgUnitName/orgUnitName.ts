import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useOrganisationUnit } from '../../dataQueries';
import type { OrgUnitNames } from './orgUnitName.types';
import type { QuerySingleResource } from '../../utils/api';

// Avoid exporting displayNameCache to keep it truly private.
// As a consequence all functions using it must be in this file.
const displayNameCache: any = {};
const maxBatchSize = 50;

const fields = 'id,displayName,ancestors[id,displayName]';
const resource = 'organisationUnits';

const displayNamesQuery = {
    organisationUnits: {
        resource,
        params: ({ filter }: any) => ({
            fields,
            filter: `id:in:[${filter}]`,
            pageSize: maxBatchSize,
        }),
    },
};

const displayNameQuery = (orgUnitId: string) => ({
    resource,
    id: orgUnitId,
    params: {
        fields,
    },
});

const updateCacheWithOrgUnits = (organisationUnits: any) => {
    organisationUnits.forEach(({ id, displayName, ancestors }: any) => {
        if (ancestors.length > 0) {
            displayNameCache[id] = {
                displayName,
                ancestor: ancestors[ancestors.length - 1].id,
            };

            ancestors.findLast((ancestor: any, index: any) => {
                if (displayNameCache[ancestor.id]) {
                    // Ancestors already cached
                    return true;
                } else if (index > 0) {
                    // Add orgunit WITH ancestor to cache
                    displayNameCache[ancestor.id] = {
                        displayName: ancestor.displayName,
                        ancestor: ancestors[index - 1].id,
                    };
                    return false;
                }
                // Add orgunit WITHOUT ancestor to cache
                displayNameCache[ancestor.id] = { displayName: ancestor.displayName };
                return true;
            });
        } else {
            displayNameCache[id] = { displayName };
        }
    });
};

const createBatches = (orgUnitIds: Array<string>): Array<Array<string>> => {
    const reducedOrgUnitIds = Array.from(orgUnitIds
        .filter(id => id)
        .reduce((acc, id) => {
            if (!displayNameCache[id]) {
                acc.add(id);
            }
            return acc;
        }, new Set<string>()));

    const batches: Array<Array<string>> = [];
    for (let i = 0; i < reducedOrgUnitIds.length; i += maxBatchSize) {
        batches.push(reducedOrgUnitIds.slice(i, i + maxBatchSize));
    }

    return batches;
};

const getAncestors = (orgUnitId: any, property: any) => {
    const orgUnit = orgUnitId && displayNameCache[orgUnitId];

    if (!orgUnit) return [];

    const ancestors = getAncestors(orgUnit.ancestor, property);
    ancestors.push(property === 'id' ? orgUnitId : orgUnit[property]);

    return ancestors;
};

// Works best with memoized input arrays.
export const useOrgUnitNames = (orgUnitIds: Array<string>): {
    loading: boolean,
    orgUnitNames?: OrgUnitNames,
    error: any,
} => {
    const [fetching, setFetching] = useState(false);
    const [fetchNextBatch, setFetchNextBatch] = useState(false);
    const [requestedArray, setRequestedArray] = useState<any>();
    const [currentBatches, setCurrentBatches] = useState<Array<Array<string>>>([]);
    const [completedBatches, setCompletedBatches] = useState(0);
    const [error, setError] = useState<any>();

    const ready = !fetching && orgUnitIds === requestedArray;

    const batches = useMemo(() => createBatches(orgUnitIds), [orgUnitIds]);
    const filter = useMemo(() => (fetching ? currentBatches[completedBatches].join(',') : ''), [fetching, currentBatches, completedBatches]);
    const result = useMemo(() => (ready ? orgUnitIds.reduce((acc: any, id) => {
        acc[id] = displayNameCache[id] ? displayNameCache[id].displayName : null;
        return acc;
    }, {}) : null), [ready, orgUnitIds]);

    const onComplete = useCallback(({ organisationUnits }: any) => {
        updateCacheWithOrgUnits(organisationUnits.organisationUnits);

        const completeCount = completedBatches + 1;
        setCompletedBatches(completeCount);

        if (completeCount === currentBatches.length) {
            setFetching(false);
        } else {
            setFetchNextBatch(true);
        }
    }, [completedBatches, setCompletedBatches, currentBatches, setFetching, setFetchNextBatch]);

    const onError = useCallback((fetchError: any) => {
        setFetching(false);
        setError(fetchError);
    }, [setFetching, setError]);

    const { refetch } = useDataQuery(displayNamesQuery, {
        variables: { filter },
        onComplete,
        onError,
        lazy: true,
    });

    useEffect(() => {
        if (!fetching && orgUnitIds !== requestedArray) {
            setRequestedArray(orgUnitIds);
            if (batches.length > 0) {
                setFetching(true);
                setError(undefined);
                setFetchNextBatch(true);
                setCurrentBatches(batches);
                setCompletedBatches(0);
            }
        }
    }, [fetching, orgUnitIds, requestedArray, batches]);

    useEffect(() => {
        if (fetchNextBatch) {
            setFetchNextBatch(false);
            if (completedBatches < currentBatches.length) {
                refetch({ filter });
            }
        }
    }, [fetchNextBatch, completedBatches, currentBatches, refetch, filter]);

    return {
        loading: !ready && !error,
        orgUnitNames: ready && !error ? result : undefined,
        error,
    };
};

export async function getOrgUnitNames(orgUnitIds: Array<string>, querySingleResource: QuerySingleResource): Promise<{
[orgUnitId: string]: {
    id: string,
        displayName: string,
    }
}> {
    await Promise.all(createBatches(orgUnitIds)
        .map(batch => querySingleResource(displayNamesQuery.organisationUnits, { filter: batch.join(',') })
            .then(({ organisationUnits }: any) => {
                updateCacheWithOrgUnits(organisationUnits);
            }),
        ),
    );

    return orgUnitIds.reduce((acc: any, orgUnitId) => {
        acc[orgUnitId] = {
            id: orgUnitId,
            name: displayNameCache[orgUnitId]?.displayName,
        };
        return acc;
    }, {});
}

export const useOrgUnitNameWithAncestors = (orgUnitId?: string | null): {
    displayName?: string,
    ancestors?: Array<string>,
    error: any,
} => {
    const cachedOrgUnit = orgUnitId && displayNameCache[orgUnitId];
    const fetchId = cachedOrgUnit ? undefined : orgUnitId;
    const { orgUnit: fetchedOrgUnit, error } = useOrganisationUnit(fetchId, 'displayName,ancestors[id,displayName]');

    if (orgUnitId && cachedOrgUnit) {
        const ancestors = getAncestors(cachedOrgUnit.ancestor, 'displayName');

        return {
            displayName: cachedOrgUnit.displayName,
            ancestors,
            error,
        };
    } else if (fetchedOrgUnit && fetchId) {
        updateCacheWithOrgUnits([fetchedOrgUnit]);
        const ancestors = fetchedOrgUnit.ancestors.map((ancestor: any) => ancestor.displayName);

        return {
            displayName: fetchedOrgUnit.displayName,
            ancestors,
            error,
        };
    }

    return { error };
};

export const getAncestorIds = async (orgUnitId: string, querySingleResource: QuerySingleResource) => {
    const cachedOrgUnit = displayNameCache[orgUnitId];
    if (cachedOrgUnit) {
        return getAncestors(cachedOrgUnit.ancestor, 'id');
    }

    const apiOrgUnit = await querySingleResource(displayNameQuery(orgUnitId));
    updateCacheWithOrgUnits([apiOrgUnit]);
    return getAncestors(displayNameCache[orgUnitId].ancestor, 'id');
};

export const getCachedOrgUnitName = (orgUnitId: string): string | undefined => displayNameCache[orgUnitId]?.displayName;
