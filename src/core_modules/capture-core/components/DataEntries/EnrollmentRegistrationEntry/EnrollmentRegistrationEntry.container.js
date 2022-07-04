// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import { startNewEnrollmentDataEntryInitialisation } from './EnrollmentRegistrationEntry.actions';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { scopeTypes } from '../../../metaData';

const useInitialiseEnrollmentRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType } = useScopeInfo(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKER_PROGRAM && orgUnit.code) {
            dispatch(
                startNewEnrollmentDataEntryInitialisation(
                    { orgUnit, selectedScopeId, dataEntryId, formFoundation },
                ),
            );
        }
    }, [
        scopeType,
        dataEntryId,
        selectedScopeId,
        orgUnit,
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
