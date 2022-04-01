// @flow
import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { useSelector, useDispatch } from 'react-redux';
import { OptOut as OptOutComponent } from './OptOut.component';
import type { Props } from './optOut.types';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { saveDataStore } from '../../DataStore';

const dataStoreUpdate = {
    resource: 'dataStore/capture/useNewDashboard',
    type: 'update',
    data: ({ programId, optIn }) => ({
        [programId]: optIn,
    }),
};

export const OptOut = ({ programId }: Props) => {
    const dispatch = useDispatch();
    const [updateMutation, { loading: loadingUpdate }] = useDataMutation(dataStoreUpdate, {
        onComplete: () => {
            dispatch(saveDataStore({ dataStore: { [programId]: false } }));
        },
    });
    const handleOptOut = useCallback(() => {
        updateMutation({ programId, optIn: false });
    }, [programId, updateMutation]);

    const { programName, access } = useScopeInfo(programId);
    const newDashboard = useSelector(({ useNewDashboard }) => useNewDashboard);
    const { dataStore } = newDashboard;
    const showOptOut = access?.write && dataStore?.[programId];

    return showOptOut ? (
        <OptOutComponent programName={programName} handleOptOut={handleOptOut} loading={loadingUpdate} />
    ) : null;
};
