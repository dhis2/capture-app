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
    const { dataStore, userDataStore } = useSelector(({ useNewDashboard }) => useNewDashboard);

    const getUrl = useCallback(() => {
        if (shouldUseNewDashboard({ userDataStore, dataStore, programId: linkProgramId, teiId: id })) {
            return `/#/enrollment?${buildUrlQueryString({
                teiId: id,
                programId: linkProgramId,
                orgUnitId,
                enrollmentId: 'AUTO',
            })}`;
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

