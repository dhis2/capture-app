// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { TeiRegistrationEntryComponent } from './TeiRegistrationEntry.component';
import { useFormValues } from '../../DataEntries/EnrollmentRegistrationEntry/hooks';

const useInitialiseTeiRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType, trackedEntityName } = useScopeInfo(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();
    const selectedOrgUnitId = orgUnit.id;
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const searchTerms = useSelector(({ searchPage }) => searchPage.currentSearchInfo.currentSearchTerms);
    const { formValues } = useFormValues({ formFoundation, clientAttributesWithSubvalues: {}, orgUnit, searchTerms });

    const registrationFormReady = useMemo(() => {
        if (searchTerms) {
            return Object.keys(formValues).length > 0 && !!formId;
        }
        return !!formId;
    }, [formId, searchTerms, formValues]);

    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE) {
            dispatch(
                startNewTeiDataEntryInitialisation(
                    { selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation, formValues },
                ));
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
