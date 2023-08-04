// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useLifecycle } from './hooks';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useRulesEngineOrgUnit } from '../../../hooks';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { useMetadataForRegistrationForm } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm';

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({
    selectedScopeId,
    id,
    saveButtonText,
    trackedEntityInstanceAttributes,
    cachedOrgUnitId,
    ...passOnProps
}) => {
    const orgUnitId = useCurrentOrgUnitInfo().id;
    const { orgUnit, error } = useRulesEngineOrgUnit(cachedOrgUnitId ?? orgUnitId);
    const { teiId, ready, skipDuplicateCheck } = useLifecycle(selectedScopeId, id, trackedEntityInstanceAttributes, orgUnit);
    const {
        formId,
        registrationMetaData: enrollmentMetadata,
        formFoundation,
    } = useMetadataForRegistrationForm({ selectedScopeId });

    const isUserInteractionInProgress: boolean = useSelector(
        state =>
            dataEntryHasChanges(state, 'newPageDataEntryId-newEnrollment')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newTei')
          || dataEntryHasChanges(state, 'relationship-newTei')
          || dataEntryHasChanges(state, 'relationship-newEnrollment'),
    );
    const trackedEntityTypeNameLC = enrollmentMetadata?.trackedEntityType?.name.toLocaleLowerCase() ?? '';


    const isSavingInProgress = useSelector(({ possibleDuplicates, newPage }) =>
        possibleDuplicates.isLoading || possibleDuplicates.isUpdating || !!newPage.uid);

    if (error) {
        return error.errorComponent;
    }

    return (
        <EnrollmentRegistrationEntryComponent
            {...passOnProps}
            selectedScopeId={selectedScopeId}
            formId={formId}
            formFoundation={formFoundation}
            id={id}
            saveButtonText={saveButtonText(trackedEntityTypeNameLC)}
            ready={ready && !!enrollmentMetadata}
            teiId={teiId}
            enrollmentMetadata={enrollmentMetadata}
            skipDuplicateCheck={skipDuplicateCheck}
            orgUnitId={orgUnitId}
            orgUnit={orgUnit}
            isUserInteractionInProgress={isUserInteractionInProgress}
            isSavingInProgress={isSavingInProgress}
        />
    );
};
