// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { Enrollment, scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { TeiRegistrationEntryComponent } from './TeiRegistrationEntry.component';
import { useFormValuesFromSearchTerms } from './hooks/useFormValuesFromSearchTerms';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { useMetadataForRegistrationForm } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm';

const useInitialiseTeiRegistration = (selectedScopeId, dataEntryId, orgUnitId) => {
    const dispatch = useDispatch();
    const { scopeType, trackedEntityName } = useScopeInfo(selectedScopeId);
    const { formId, formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
    const formValues = useFormValuesFromSearchTerms();
    const registrationFormReady = !!formId;

    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE) {
            dispatch(
                startNewTeiDataEntryInitialisation(
                    { selectedOrgUnitId: orgUnitId, selectedScopeId, dataEntryId, formFoundation, formValues },
                ));
        }
    }, [
        scopeType,
        dataEntryId,
        selectedScopeId,
        registrationFormReady,
        formFoundation,
        formValues,
        dispatch,
        orgUnitId,
    ]);

    return {
        trackedEntityName,
    };
};


export const TeiRegistrationEntry: ComponentType<OwnProps> = ({ selectedScopeId, id, orgUnitId, ...rest }) => {
    const { trackedEntityName } = useInitialiseTeiRegistration(selectedScopeId, id, orgUnitId);
    const ready = useSelector(({ dataEntries }) => (!!dataEntries[id]));
    const dataEntry = useSelector(({ dataEntries }) => (dataEntries[id]));
    const {
        registrationMetaData: teiRegistrationMetadata,
    } = useMetadataForRegistrationForm({ selectedScopeId });

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

    if (!teiRegistrationMetadata || teiRegistrationMetadata instanceof Enrollment) {
        return null;
    }

    return (
        <TeiRegistrationEntryComponent
            id={id}
            orgUnitId={orgUnitId}
            teiRegistrationMetadata={teiRegistrationMetadata}
            selectedScopeId={teiRegistrationMetadata.form?.id}
            ready={ready && !!teiRegistrationMetadata}
            trackedEntityName={trackedEntityName}
            isUserInteractionInProgress={isUserInteractionInProgress}
            {...rest}
        />
    );
};
