import React, { useRef } from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { EnrollmentRegistrationEntryComponent } from './EnrollmentRegistrationEntry.component';
import type { OwnProps } from './EnrollmentRegistrationEntry.types';
import { useLifecycle } from './hooks';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import {
    useBuildEnrollmentPayload,
} from './hooks/useBuildEnrollmentPayload';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';

export const EnrollmentRegistrationEntry: ComponentType<OwnProps> = ({
    selectedScopeId,
    id,
    saveButtonText,
    trackedEntityInstanceAttributes,
    orgUnitId,
    teiId,
    onSave,
    onCancel,
    ...passOnProps
}) => {
    const relatedStageRef = useRef<RelatedStageRefPayload | null>(null);
    const { orgUnit, error } = useCoreOrgUnit(orgUnitId);
    const {
        ready,
        skipDuplicateCheck,
        firstStageMetaData,
        formId,
        enrollmentMetadata,
        formFoundation,
    } = useLifecycle(selectedScopeId, id, trackedEntityInstanceAttributes, orgUnit, teiId);
    const { buildTeiWithEnrollment } = useBuildEnrollmentPayload({
        programId: selectedScopeId,
        dataEntryId: id,
        orgUnitId,
        teiId,
        trackedEntityTypeId: enrollmentMetadata?.trackedEntityType?.id,
    });

    const isUserInteractionInProgress: boolean = useSelector(
        (state: any) =>
            dataEntryHasChanges(state, 'newPageDataEntryId-newEnrollment')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newTei')
          || dataEntryHasChanges(state, 'relationship-newTei')
          || dataEntryHasChanges(state, 'relationship-newEnrollment'),
    );
    const trackedEntityTypeNameLC = enrollmentMetadata?.trackedEntityType?.name.toLocaleLowerCase() ?? '';

    const isSavingInProgress = useSelector(({ possibleDuplicates, newPage }: any) =>
        possibleDuplicates.isLoading || possibleDuplicates.isUpdating || !!newPage.uid);


    if (error) {
        return error.errorComponent;
    }

    const onSaveWithEnrollment = () => {
        const { teiWithEnrollment, formHasError, redirect } =
            buildTeiWithEnrollment(relatedStageRef);
        !formHasError && onSave(teiWithEnrollment, redirect);
    };

    return (
        <EnrollmentRegistrationEntryComponent
            {...passOnProps}
            relatedStageRef={relatedStageRef}
            firstStageMetaData={firstStageMetaData}
            selectedScopeId={selectedScopeId}
            formId={formId}
            formFoundation={formFoundation}
            id={id}
            onCancel={onCancel}
            saveButtonText={saveButtonText(trackedEntityTypeNameLC)}
            ready={ready && !!enrollmentMetadata}
            teiId={teiId}
            enrollmentMetadata={enrollmentMetadata}
            skipDuplicateCheck={skipDuplicateCheck}
            orgUnitId={orgUnitId}
            orgUnit={orgUnit}
            isUserInteractionInProgress={isUserInteractionInProgress}
            isSavingInProgress={isSavingInProgress}
            onSave={onSaveWithEnrollment}
        />
    );
};
