// @flow
import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { useSelector, useDispatch } from 'react-redux';
import { OptIn as OptInComponent } from './OptIn.component';
import type { Props } from './optIn.types';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { saveDataStore } from '../../DataStore';

const dataStoreUpdate = {
    resource: 'dataStore/capture/useNewDashboard',
    type: 'update',
    data: ({ programId, optIn }) => ({
        [programId]: optIn,
    }),
};

const dataStoreCreate = {
    resource: 'dataStore/capture/useNewDashboard',
    type: 'create',
    data: ({ programId, optIn }) => ({
        [programId]: optIn,
    }),
};

export const OptIn = ({ programId }: Props) => {
    const dispatch = useDispatch();
    const { programName, access } = useScopeInfo(programId);
    const newDashboard = useSelector(({ useNewDashboard }) => useNewDashboard);
    const { dataStore } = newDashboard;
    const showOptIn = access?.write && !dataStore?.[programId];

    const [updateMutation, { loading: loadingUpdate }] = useDataMutation(dataStoreUpdate, {
        onComplete: () => {
            dispatch(saveDataStore({ dataStore: { [programId]: true } }));
        },
    });
    const [createMutation, { loading: loadingCreate }] = useDataMutation(dataStoreCreate, {
        onComplete: () => {
            dispatch(saveDataStore({ dataStore: { [programId]: true } }));
        },
    });

    const handleOptIn = useCallback(() => {
        dataStore ? updateMutation({ programId, optIn: true }) : createMutation({ programId, optIn: true });
    }, [programId, updateMutation, createMutation, dataStore]);

    return showOptIn ? (
        <OptInComponent
            programName={programName}
            handleOptIn={handleOptIn}
            loading={dataStore ? loadingUpdate : loadingCreate}
        />
    ) : null;
};
