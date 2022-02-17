// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import { startNewEnrollmentDataEntryInitialisation } from './EnrollmentRegistrationEntry.actions';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { useLifecycle } from './hooks';

const useInitialiseEnrollmentRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { formId, formFoundation, formValues, selectedOrgUnitId } = useLifecycle({selectedScopeId});
    const registrationFormReady = !!formId;
    console.log('useInitialiseEnrollmentRegistration', formValues);
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKER_PROGRAM) {
            dispatch(
                startNewEnrollmentDataEntryInitialisation(
                    { selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation, formValues },
                ),
            );
        }
    }, [
        scopeType,
        dataEntryId,
        selectedScopeId,
        selectedOrgUnitId,
        registrationFormReady,
        formFoundation,
        formValues,
        dispatch,
    ]);
};

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, id, ...passOnProps }) => {
    useInitialiseEnrollmentRegistration(selectedScopeId, id);
    const ready = useSelector(({ dataEntries }) => (!!dataEntries[id]));

    return (
        <EnrollmentRegistrationEntryComponent
            {...passOnProps}
            selectedScopeId={selectedScopeId}
            id={id}
            ready={ready}
        />);
};
