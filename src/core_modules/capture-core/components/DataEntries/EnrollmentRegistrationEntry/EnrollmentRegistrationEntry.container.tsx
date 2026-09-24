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
    const savingRef = useRef(false);
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
        trackedEntityTypeId: enrollmentMetadata?.trackedEntityType?.id || undefined,
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

    if (!formFoundation) {
        return null;
    }

    if (error) {
        return error.errorComponent;
    }

    const onSaveWithEnrollment = async () => {
        if (savingRef.current) return;
        savingRef.current = true;
        try {
            const { teiWithEnrollment, formHasError, redirect } =
                await buildTeiWithEnrollment(relatedStageRef);
            if (!formHasError) onSave(teiWithEnrollment, redirect);
        } finally {
            savingRef.current = false;
        }
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
