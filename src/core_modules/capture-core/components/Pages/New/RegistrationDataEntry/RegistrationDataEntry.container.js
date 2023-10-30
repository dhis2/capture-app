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
import { cleanUpDataEntry, openNewPage } from '../NewPage.actions';
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
}) => {
    const dispatch = useDispatch();
    const { teiId } = useLocationQuery();

    const dispatchOnSaveWithoutEnrollment = useCallback(
        (teiPayload) => { dispatch(startSavingNewTrackedEntityInstance(teiPayload)); },
        [dispatch]);

    const dispatchOnSaveWithEnrollment = useCallback(
        (enrollmentPayload) => {
            const uid = uuid();
            dispatch(startSavingNewTrackedEntityInstanceWithEnrollment(enrollmentPayload, uid));
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
        />);
};
