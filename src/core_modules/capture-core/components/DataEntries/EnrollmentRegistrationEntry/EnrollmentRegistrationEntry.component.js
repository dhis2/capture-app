// @flow
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { startNewEnrollmentDataEntryInitialisation } from './EnrollmentRegistrationEntry.actions';
import { EnrollmentDataEntry } from '../Enrollment';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';

const useDataEntryLifecycle = (selectedScopeId, dataEntryId, scopeType) => {
    const dispatch = useDispatch();
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

export const EnrollmentRegistrationEntry = ({ selectedScopeId, id, ...rest }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    useDataEntryLifecycle(selectedScopeId, id, scopeType);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

    return (
        <>
            {
                scopeType === scopeTypes.TRACKER_PROGRAM && formId &&
                <EnrollmentDataEntry
                    orgUnit={orgUnit}
                    programId={selectedScopeId}
                    formFoundation={formFoundation}
                    enrollmentMetadata={registrationMetaData}
                    id={id}
                    {...rest}
                />
            }
        </>
    );
};
