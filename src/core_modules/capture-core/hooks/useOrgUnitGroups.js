// @flow
import { useState, useEffect, useRef } from 'react';
import { getUserStorageController } from 'capture-core/storageControllers';
import type { OrgUnitGroup } from 'capture-core-utils/rulesEngine';

type Request = {
    orgUnitId: ?string,
    requestId: number,
    fetching: boolean,
};

async function getAssociatedOrgUnitGroups(orgUnitId: string): any {
    const storageController = getUserStorageController();
    const orgUnitGroups = await storageController.getAll(
        'organisationUnitGroups', {
            project: item => ({ id: item.id, code: item.code }),
            onIDBGetRequest: source => source
                .index('organisationUnitId')
                .openCursor(window.IDBKeyRange.only(orgUnitId)),
        },
    );
    return orgUnitGroups;
}

export function useOrgUnitGroups(orgUnitId: ?string): ?Array<OrgUnitGroup> {
    const lastRequest = useRef<Request>({ orgUnitId: undefined, requestId: 0, fetching: false });
    const [orgUnitGroups, setOrgUnitGroups] = useState();

    let currentRequestId;

    if (orgUnitId && orgUnitId !== lastRequest.current.orgUnitId) {
        currentRequestId = lastRequest.current.requestId + 1;
        lastRequest.current = {
            orgUnitId,
            requestId: currentRequestId,
            fetching: true,
        };
    }

    useEffect(() => {
        if (!orgUnitId || currentRequestId !== lastRequest.current.requestId) {
            return;
        }
        getAssociatedOrgUnitGroups(orgUnitId).then((response) => {
            if (currentRequestId === lastRequest.current.requestId) {
                lastRequest.current.fetching = false;
                setOrgUnitGroups(response);
            }
        });
    }, [orgUnitId, currentRequestId]);

    return lastRequest.current.fetching ? undefined : orgUnitGroups;
}
