// @flow
import { useState, useEffect, useRef } from 'react';
import { getAssociatedOrgUnitGroups } from 'capture-core/MetaDataStoreUtils/getAssociatedOrgUnitGroups';
import type { OrgUnitGroup } from 'capture-core-utils/rulesEngine';

type Request = {
    orgUnitId: ?string,
    requestId: number,
    fetching: boolean,
};

export function useOrgUnitGroups(orgUnitId: ?string): {
    orgUnitGroups?: Array<OrgUnitGroup>,
    error: any,
} {
    const lastRequest = useRef<Request>({ orgUnitId: undefined, requestId: 0, fetching: false });
    const [orgUnitGroups, setOrgUnitGroups] = useState();
    const [error, setError] = useState();

    let currentRequestId;

    if (orgUnitId && orgUnitId !== lastRequest.current.orgUnitId) {
        currentRequestId = lastRequest.current.requestId + 1;
        lastRequest.current = {
            orgUnitId,
            requestId: currentRequestId,
            fetching: true,
        };
        setError(undefined);
    }

    useEffect(() => {
        if (!orgUnitId || currentRequestId !== lastRequest.current.requestId) {
            return;
        }
        getAssociatedOrgUnitGroups(orgUnitId)
            .then((response) => {
                if (currentRequestId === lastRequest.current.requestId) {
                    lastRequest.current.fetching = false;
                    setOrgUnitGroups(response);
                }
            })
            .catch(setError);
    }, [orgUnitId, currentRequestId]);

    return lastRequest.current.fetching ? { error } : { orgUnitGroups, error };
}
