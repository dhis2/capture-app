// @flow
import React, { useCallback } from 'react';
import { useConfig } from '@dhis2/app-runtime';
import { useSelector } from 'react-redux';
import { buildUrl } from 'capture-core-utils';
import { systemSettingsStore } from '../../../../../../metaDataMemoryStores';
import { buildUrlQueryString, shouldUseNewDashboard } from '../../../../../../utils/routing';

type Props = {
    name: string,
    id: string,
    orgUnitId: string,
    linkProgramId?: ?string,
};

export const TrackedEntityInstance = ({ name, id, orgUnitId, linkProgramId }: Props) => {
    const { baseUrl } = useConfig();
    const { dataStore, userDataStore, temp } = useSelector(({ useNewDashboard }) => useNewDashboard);

    const getUrl = useCallback(() => {
        if (linkProgramId && shouldUseNewDashboard(userDataStore, dataStore, temp, linkProgramId)) {
            return `/#/enrollment?${buildUrlQueryString({ teiId: id, programId: linkProgramId, orgUnitId })}`;
        }
        const trackerBaseUrl = buildUrl(baseUrl, systemSettingsStore.get().trackerAppRelativePath, '/#/dashboard?');
        const baseParams = `tei=${id}&ou=${orgUnitId}`;
        const params = linkProgramId ? `${baseParams}&program=${linkProgramId}` : baseParams;
        return trackerBaseUrl + params;
    }, [
        baseUrl,
        id,
        orgUnitId,
        linkProgramId,
        dataStore,
        userDataStore,
        temp,
    ]);

    return (
        <a
            href={getUrl()}
            target="_blank"
            rel="noopener noreferrer"
        >
            {name}
        </a>
    );
};

