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
            fields: 'id,displayName',
            filter: `id:in:[${filter}]`,
            pageSize: maxBatchSize,
        }),
    },
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

    const batches = useMemo(
        () => createBatches(orgUnitIds),
        [orgUnitIds],
    );
    const filter = useMemo(
        () => (fetching ? currentBatches[completedBatches].join(',') : ''),
        [fetching, currentBatches, completedBatches],
    );
    const result = useMemo(
        () => (ready ? orgUnitIds.reduce((acc, id) => {
            acc[id] = displayNameCache[id];
            return acc;
        }, {}) : null),
        [ready, orgUnitIds],
    );

    const onComplete = useCallback(({ organisationUnits }) => {
        for (const { id, displayName } of organisationUnits.organisationUnits) {
            displayNameCache[id] = displayName;
        }
        const completeCount = completedBatches + 1;
        setCompletedBatches(completeCount);
        if (completeCount === currentBatches.length) {
            setFetching(false);
        } else {
            setFetchNextBatch(true);
        }
    }, [completedBatches, setCompletedBatches, currentBatches, setFetching, setFetchNextBatch]);

    const onError = useCallback(
        (fetchError) => {
            setFetching(false);
            setError(fetchError);
        },
        [setFetching, setError],
    );

    const { refetch } = useDataQuery(
        displayNamesQuery, {
            variables: { filter },
            onComplete,
            onError,
            lazy: true,
        },
    );

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
    }, [fetching, orgUnitIds, requestedArray, batches, setRequestedArray, setCurrentBatches, setCompletedBatches, setFetching, setError]);

    useEffect(() => {
        if (fetchNextBatch) {
            setFetchNextBatch(false);
            if (completedBatches < currentBatches.length) {
                refetch({ filter });
            }
        }
    }, [fetchNextBatch, setFetchNextBatch, completedBatches, currentBatches, refetch, filter]);

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
                for (const { id, displayName } of organisationUnits) {
                    displayNameCache[id] = displayName;
                }
            })));

    return orgUnitIds.reduce((acc, orgUnitId) => {
        acc[orgUnitId] = {
            id: orgUnitId,
            name: displayNameCache[orgUnitId],
        };
        return acc;
    }, {});
}

export const useOrgUnitName = (orgUnitId: ?string): {
    displayName?: string,
    error?: any,
} => {
    const cachedOrgUnitName = orgUnitId && displayNameCache[orgUnitId];
    const fetchId = cachedOrgUnitName ? undefined : orgUnitId;
    const { orgUnit, error } = useOrganisationUnit(fetchId, 'displayName');
    if (cachedOrgUnitName) {
        return { displayName: cachedOrgUnitName };
    } else if (orgUnit && fetchId) {
        displayNameCache[orgUnit.id] = orgUnit.displayName;
        if (orgUnit.id === fetchId) {
            return { displayName: orgUnit.displayName, error };
        }
    }
    return { error };
};

export const getCachedOrgUnitName = (orgUnitId: string): ?string => displayNameCache[orgUnitId];
