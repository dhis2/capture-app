// @flow
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../../metaData';
import { startDataEntryInitialisation } from './RegistrationDataEntry.actions';
import { EnrollmentDataEntry, TrackedEntityInstanceDataEntry } from '../../../DataEntries';
import { useCurrentOrgUnitInfo } from '../../../../hooks/useCurrentOrgUnitInfo';
import type { OwnProps } from './RegistrationDataEntry.types';
import { useRegistrationFormInfoForSelectedScope } from './useRegistrationFormInfoForSelectedScope';

const useDataEntryLifecycle = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const selectedOrgUnitInfo = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);

    useEffect(() => {
        if (formId) {
            dispatch(startDataEntryInitialisation({ selectedOrgUnitInfo, dataEntryId, formFoundation }));
        }
    }, [selectedOrgUnitInfo, formId, dataEntryId, dispatch, formFoundation]);
};


export const RegistrationDataEntry = ({ selectedScopeId, dataEntryId }: OwnProps) => {
    useDataEntryLifecycle(selectedScopeId, dataEntryId);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();
    const { scopeType } = useScopeInfo(selectedScopeId);

    return (
        <>
            {
                formId &&
                <>
                    {
                        scopeType === scopeTypes.TRACKER_PROGRAM &&
                        <EnrollmentDataEntry
                            orgUnit={orgUnit}
                            programId={selectedScopeId}
                            formFoundation={formFoundation}
                            enrollmentMetadata={registrationMetaData}
                            id={dataEntryId}
                        />
                    }
                    {
                        scopeType === scopeTypes.TRACKED_ENTITY_TYPE &&
                        <TrackedEntityInstanceDataEntry
                            orgUnit={orgUnit}
                            formFoundation={formFoundation}
                            programId={selectedScopeId}
                            teiRegistrationMetadata={registrationMetaData}
                            id={dataEntryId}
                        />
                    }

                </>
            }
        </>
    );
};
