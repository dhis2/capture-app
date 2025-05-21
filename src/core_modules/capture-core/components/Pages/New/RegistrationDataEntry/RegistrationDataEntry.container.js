// @flow
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import React, { useCallback, type ComponentType, useEffect } from 'react';
import { useLocationQuery } from '../../../../utils/routing';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import type { OwnProps } from './RegistrationDataEntry.types';
import {
    startSavingNewTrackedEntityInstance,
    startSavingNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { openNewPage } from '../NewPage.actions';
import { cleanUpDataEntry } from '../../../DataEntry';
import {
    NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID,
    NEW_SINGLE_EVENT_DATA_ENTRY_ID,
    NEW_TEI_DATA_ENTRY_ID,
} from '../NewPage.constants';

export const RegistrationDataEntry: ComponentType<OwnProps> = ({
    selectedScopeId,
    dataEntryId,
    setScopeId,
    trackedEntityInstanceAttributes,
    newPageKey,
}) => {
    const dispatch = useDispatch();
    const { teiId } = useLocationQuery();

    const dispatchOnSaveWithoutEnrollment = useCallback(
        (teiPayload) => { dispatch(startSavingNewTrackedEntityInstance(teiPayload)); },
        [dispatch]);

    const dispatchOnSaveWithEnrollment = useCallback(
        (enrollmentPayload, redirect) => {
            const uid = uuid();
            dispatch(
                startSavingNewTrackedEntityInstanceWithEnrollment(
                    enrollmentPayload,
                    uid,
                    redirect,
                ),
            );
        },
        [dispatch]);

    const dataEntryIsReady = useSelector(({ dataEntries }) => (!!dataEntries[dataEntryId]));

    useEffect(() => {
        dispatch(openNewPage());
        return () => {
            dispatch(cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID));
            dispatch(cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID));
            dispatch(cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID));
        };
    }, [dispatch]);

    return (
        <RegistrationDataEntryComponent
            dataEntryId={dataEntryId}
            selectedScopeId={selectedScopeId}
            setScopeId={setScopeId}
            dataEntryIsReady={dataEntryIsReady}
            onSaveWithoutEnrollment={dispatchOnSaveWithoutEnrollment}
            onSaveWithEnrollment={dispatchOnSaveWithEnrollment}
            teiId={teiId}
            trackedEntityInstanceAttributes={trackedEntityInstanceAttributes}
            key={newPageKey}
        />);
};
