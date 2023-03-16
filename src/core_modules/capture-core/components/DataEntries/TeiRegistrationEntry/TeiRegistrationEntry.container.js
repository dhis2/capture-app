// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { TeiRegistrationEntryComponent } from './TeiRegistrationEntry.component';
import { useFormValuesFromSearchTerms } from './hooks/useFormValuesFromSearchTerms';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { useMetadataForRegistrationForm } from '../../../hooks/useMetadataForRegistrationForm';

const useInitialiseTeiRegistration = (selectedScopeId, dataEntryId) => {
    const dispatch = useDispatch();
    const { scopeType, trackedEntityName } = useScopeInfo(selectedScopeId);
    const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
    const formValues = useFormValuesFromSearchTerms();
    const registrationFormReady = !!formId;

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


export const TeiRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, teiRegistrationMetadata, id, ...rest }) => {
    const { trackedEntityName } = useInitialiseTeiRegistration(selectedScopeId, id);
    const ready = useSelector(({ dataEntries }) => (!!dataEntries[id]));
    const dataEntry = useSelector(({ dataEntries }) => (dataEntries[id]));

    const dataEntryKey = useMemo(() => {
        if (dataEntry) {
            return `${id}-${dataEntry.itemId}`;
        }
        return '';
    }, [id, dataEntry]);

    const isUserInteractionInProgress: boolean = useSelector(
        state =>
            dataEntryHasChanges(state, dataEntryKey),
    );

    if (!teiRegistrationMetadata) {
        return null;
    }

    return (
        <TeiRegistrationEntryComponent
            selectedScopeId={selectedScopeId}
            id={id}
            ready={ready && !!teiRegistrationMetadata}
            teiRegistrationMetadata={teiRegistrationMetadata}
            trackedEntityName={trackedEntityName}
            isUserInteractionInProgress={isUserInteractionInProgress}
            {...rest}
        />);
};
