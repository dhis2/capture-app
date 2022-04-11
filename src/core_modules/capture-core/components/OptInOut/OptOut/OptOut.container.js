// @flow
import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { useSelector, useDispatch } from 'react-redux';
import { OptOut as OptOutComponent } from './OptOut.component';
import type { Props } from './optOut.types';
import { useTrackerProgram } from '../../../hooks/useTrackerProgram';
import { saveDataStore } from '../../DataStore';

const dataStoreUpdate = {
    resource: 'dataStore/capture/useNewDashboard',
    type: 'update',
    data: ({ data }) => data,
};

export const OptOut = ({ programId }: Props) => {
    const dispatch = useDispatch();
    const program = useTrackerProgram(programId);
    const newDashboard = useSelector(({ useNewDashboard }) => useNewDashboard);
    const { dataStore } = newDashboard;

    const [updateMutation, { loading: loadingUpdate }] = useDataMutation(dataStoreUpdate, {
        onComplete: () => {
            dispatch(saveDataStore({ dataStore: { ...dataStore, [programId]: false } }));
        },
    });
    const handleOptOut = useCallback(() => {
        const data = { ...dataStore, [programId]: false };
        updateMutation({ data });
    }, [programId, updateMutation, dataStore]);
    const showOptOut = program?.access?.write && dataStore?.[programId];

    return showOptOut ? (
        <OptOutComponent programName={program?.name} handleOptOut={handleOptOut} loading={loadingUpdate} />
    ) : null;
};
