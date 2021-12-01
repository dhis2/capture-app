// @flow
import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import { TeiRegistrationEntryComponent } from './TeiRegistrationEntry.component';
import type { OwnProps } from './TeiRegistrationEntry.types';

const useInitialiseTeiRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE) {
            dispatch(
                startNewTeiDataEntryInitialisation(
                    { selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation },
                ));
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


export const TeiRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, id, ...rest }) => {
    useInitialiseTeiRegistration(selectedScopeId, id);
    const ready = useSelector(({ dataEntries }) => (!!dataEntries[id]));

    return (
        <TeiRegistrationEntryComponent
            selectedScopeId={selectedScopeId}
            id={id}
            ready={ready}
            {...rest}
        />);
};
