// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { scopeTypes } from '../../../metaData';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import { startNewEnrollmentDataEntryInitialisation } from './EnrollmentRegistrationEntry.actions';

const useInitialiseEnrollmentRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKER_PROGRAM) {
            dispatch(
                startNewEnrollmentDataEntryInitialisation(
                    { selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation },
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
