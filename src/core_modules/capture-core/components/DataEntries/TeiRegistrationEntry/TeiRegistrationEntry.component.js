// @flow
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';

const useDataEntryLifecycle = (selectedScopeId, dataEntryId, scopeType) => {
    const dispatch = useDispatch();
    const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE) {
            dispatch(startNewTeiDataEntryInitialisation({ selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation }));
        }
    }, [scopeType, dataEntryId, selectedScopeId, selectedOrgUnitId, registrationFormReady, formFoundation, dispatch]);
};

export const TeiRegistrationEntry = ({ selectedScopeId, id, ...rest }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    useDataEntryLifecycle(selectedScopeId, id, scopeType);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

    return (
        <>
            {
                scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId &&
                <TrackedEntityInstanceDataEntry
                    orgUnit={orgUnit}
                    formFoundation={formFoundation}
                    programId={selectedScopeId}
                    teiRegistrationMetadata={registrationMetaData}
                    id={id}
                    {...rest}
                />
            }
        </>
    );
};
