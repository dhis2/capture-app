// @flow
import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { useSelector, useDispatch } from 'react-redux';
import { OptIn as OptInComponent } from './OptIn.component';
import type { Props } from './optIn.types';
import { useTrackerProgram } from '../../../hooks/useTrackerProgram';
import { saveDataStore } from '../../DataStore';

const dataStoreUpdate = {
    resource: 'dataStore/capture/useNewDashboard',
    type: 'update',
    data: ({ data }) => data,
};

const dataStoreCreate = {
    resource: 'dataStore/capture/useNewDashboard',
    type: 'create',
    data: ({ data }) => data,
};

export const OptIn = ({ programId }: Props) => {
    const dispatch = useDispatch();
    const program = useTrackerProgram(programId);
    const newDashboard = useSelector(({ useNewDashboard }) => useNewDashboard);
    const { dataStore } = newDashboard;
    const showOptIn = program?.access?.write && !dataStore?.[programId];

    const [updateMutation, { loading: loadingUpdate }] = useDataMutation(dataStoreUpdate, {
        onComplete: () => {
            dispatch(saveDataStore({ dataStore: { ...dataStore, [programId]: true } }));
        },
    });
    const [createMutation, { loading: loadingCreate }] = useDataMutation(dataStoreCreate, {
        onComplete: () => {
            dispatch(saveDataStore({ dataStore: { ...dataStore, [programId]: true } }));
        },
    });

    const handleOptIn = useCallback(() => {
        if (dataStore) {
            const data = { ...dataStore, [programId]: true };
            updateMutation({ data });
        } else {
            const data = { [programId]: true };
            createMutation({ data });
        }
    }, [programId, updateMutation, createMutation, dataStore]);

    return showOptIn ? (
        <OptInComponent
            programName={program?.name}
            handleOptIn={handleOptIn}
            loading={dataStore ? loadingUpdate : loadingCreate}
        />
    ) : null;
};
