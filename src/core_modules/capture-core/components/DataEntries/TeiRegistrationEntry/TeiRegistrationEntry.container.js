// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { TeiRegistrationEntryComponent } from './TeiRegistrationEntry.component';

const useInitialiseTeiRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType, trackedEntityName } = useScopeInfo(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE && orgUnit.code) {
            dispatch(
                startNewTeiDataEntryInitialisation(
                    { orgUnit, selectedScopeId, dataEntryId, formFoundation },
                ));
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

    return {
        trackedEntityName,
    };
};


export const TeiRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, id, ...rest }) => {
    const { trackedEntityName } = useInitialiseTeiRegistration(selectedScopeId, id);
    const ready = useSelector(({ dataEntries }) => (!!dataEntries[id]));

    return (
        <TeiRegistrationEntryComponent
            selectedScopeId={selectedScopeId}
            id={id}
            ready={ready}
            trackedEntityName={trackedEntityName}
            {...rest}
        />);
};
