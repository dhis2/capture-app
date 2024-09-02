// @flow
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useOrganisationUnit } from '../../dataQueries';
import type { OrgUnitNames } from './orgUnitName.types';
import type { QuerySingleResource } from '../../utils/api';

// Avoid exporting displayNameCache to keep it truly private.
// As a consequence all functions using it must be in this file.
const displayNameCache = {};
const maxBatchSize = 50;

const displayNamesQuery = {
    organisationUnits: {
        resource: 'organisationUnits',
        params: ({ filter }) => ({
            fields: 'id,displayName,ancestors[id,displayName]',
            filter: `id:in:[${filter}]`,
            pageSize: maxBatchSize,
        }),
    },
};

const updateCacheWithOrgUnits = (organisationUnits) => {
    organisationUnits.forEach(({ id, displayName, ancestors }) => {
        if (ancestors.length > 0) {
            displayNameCache[id] = {
                displayName,
                ancestor: ancestors[ancestors.length - 1].id,
            };

            ancestors.findLast((ancestor, index) => {
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
        }, new Set()));

    const batches = [];
    for (let i = 0; i < reducedOrgUnitIds.length; i += maxBatchSize) {
        batches.push(reducedOrgUnitIds.slice(i, i + maxBatchSize));
    }

    return batches;
};

const getAncestors = (orgUnitId) => {
    const orgUnit = displayNameCache[orgUnitId];

    if (!orgUnit) return [];

    const ancestors = getAncestors(orgUnit.ancestor);
    ancestors.push(orgUnit.displayName);

    return ancestors;
};

// Works best with memoized input arrays.
export const useOrgUnitNames = (orgUnitIds: Array<string>): {
    loading: boolean,
    orgUnitNames: ?OrgUnitNames,
    error: any,
} => {
    const [fetching, setFetching] = useState(false);
    const [fetchNextBatch, setFetchNextBatch] = useState(false);
    const [requestedArray, setRequestedArray] = useState();
    const [currentBatches, setCurrentBatches] = useState([]);
    const [completedBatches, setCompletedBatches] = useState(0);
    const [error, setError] = useState();

    const ready = !fetching && orgUnitIds === requestedArray;

    const batches = useMemo(() => createBatches(orgUnitIds), [orgUnitIds]);
    const filter = useMemo(() => (fetching ? currentBatches[completedBatches].join(',') : ''), [fetching, currentBatches, completedBatches]);
    const result = useMemo(() => (ready ? orgUnitIds.reduce((acc, id) => {
        acc[id] = displayNameCache[id] ? displayNameCache[id].displayName : null;
        return acc;
    }, {}) : null), [ready, orgUnitIds]);

    const onComplete = useCallback(({ organisationUnits }) => {
        updateCacheWithOrgUnits(organisationUnits.organisationUnits);

        const completeCount = completedBatches + 1;
        setCompletedBatches(completeCount);

        if (completeCount === currentBatches.length) {
            setFetching(false);
        } else {
            setFetchNextBatch(true);
        }
    }, [completedBatches, setCompletedBatches, currentBatches, setFetching, setFetchNextBatch]);

    const onError = useCallback((fetchError) => {
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

export async function getOrgUnitNames(orgUnitIds: Array<string>, querySingleResource: QuerySingleResource): Promise<{|
[orgUnitId: string]: {|
    id: string,
        displayName: string,
    |}
|}> {
    await Promise.all(createBatches(orgUnitIds)
        .map(batch => querySingleResource(displayNamesQuery.organisationUnits, { filter: batch.join(',') })
            .then(({ organisationUnits }) => {
                updateCacheWithOrgUnits(organisationUnits);
            }),
        ),
    );

    return orgUnitIds.reduce((acc, orgUnitId) => {
        acc[orgUnitId] = {
            id: orgUnitId,
            name: displayNameCache[orgUnitId]?.displayName,
        };
        return acc;
    }, {});
}

export const useOrgUnitNameWithAncestors = (orgUnitId: ?string): {
    displayName?: string,
    ancestors?: Array<string>,
    error: any,
} => {
    const cachedOrgUnit = orgUnitId && displayNameCache[orgUnitId];
    const fetchId = cachedOrgUnit ? undefined : orgUnitId;
    const { orgUnit: fetchedOrgUnit, error } = useOrganisationUnit(fetchId, 'displayName,ancestors[id,displayName]');

    if (orgUnitId && cachedOrgUnit) {
        const ancestors = getAncestors(cachedOrgUnit.ancestor);

        return {
            displayName: cachedOrgUnit.displayName,
            ancestors,
            error,
        };
    } else if (fetchedOrgUnit && fetchId) {
        updateCacheWithOrgUnits([fetchedOrgUnit]);
        const ancestors = fetchedOrgUnit.ancestors.map(ancestor => ancestor.displayName);

        return {
            displayName: fetchedOrgUnit.displayName,
            ancestors,
            error,
        };
    }

    return { error };
};

export const getCachedOrgUnitName = (orgUnitId: string): ?string => displayNameCache[orgUnitId]?.displayName;
