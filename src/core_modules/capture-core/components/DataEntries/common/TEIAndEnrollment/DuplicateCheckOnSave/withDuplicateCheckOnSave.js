// @flow
import React, { type ComponentType, useMemo } from 'react';
import { scopeTypes, type Enrollment, type TeiRegistration } from '../../../../../metaData';
import { PossibleDuplicatesDialog } from '../../../../PossibleDuplicatesDialog';
import { useDuplicateCheckerOnSaveReduxProvider } from './useDuplicateCheckerOnSaveReduxProvider';
import { useDuplicateCheckerOnSave } from './useDuplicateCheckerOnSave';
import type { Props } from './withDuplicateCheckOnSave.types';

const getMetadataInfo = (enrollmentMetadata, teiRegistrationMetadata): { metadata?: Enrollment | TeiRegistration, scopeType: string, passOnMetadata: Object } => {
    if (enrollmentMetadata) {
        return {
            metadata: enrollmentMetadata,
            scopeType: scopeTypes.TRACKER_PROGRAM,
            passOnMetadata: {
                enrollmentMetadata,
            },
        };
    }

    return {
        metadata: teiRegistrationMetadata,
        scopeType: scopeTypes.TRACKED_ENTITY_TYPE,
        passOnMetadata: {
            teiRegistrationMetadata,
        },
    };
};

export const withDuplicateCheckOnSave = () => (WrappedComponent: ComponentType<any>) => ({
    id,
    selectedScopeId,
    onSave,
    enrollmentMetadata,
    teiRegistrationMetadata,
    duplicatesReviewPageSize,
    renderDuplicatesCardActions,
    renderDuplicatesDialogActions,
    skipDuplicateCheck,
    ...passOnProps
}: Props) => {
    const { metadata, passOnMetadata } = getMetadataInfo(enrollmentMetadata, teiRegistrationMetadata);

    const {
        hasDuplicate,
        onResetPossibleDuplicates,
        onReviewDuplicates,
    } = useDuplicateCheckerOnSaveReduxProvider(id, selectedScopeId);

    const {
        handleSaveAttempt,
        duplicatesVisible,
        closeDuplicates,
    } = useDuplicateCheckerOnSave({
        onSave,
        hasDuplicate,
        onResetPossibleDuplicates,
        onReviewDuplicates,
        searchGroup: metadata?.inputSearchGroups && metadata.inputSearchGroups[0],
        duplicatesReviewPageSize,
    });

    const duplicatesDialogActions = useMemo(() =>
        renderDuplicatesDialogActions && renderDuplicatesDialogActions(closeDuplicates, onSave), [
        renderDuplicatesDialogActions,
        closeDuplicates,
        onSave,
    ]);

    return (
        <>
            <WrappedComponent
                {...passOnProps}
                {...passOnMetadata}
                onSave={skipDuplicateCheck ? onSave : handleSaveAttempt}
                id={id}
                selectedScopeId={selectedScopeId}
            />
            <PossibleDuplicatesDialog
                dataEntryId={id}
                selectedScopeId={selectedScopeId}
                open={duplicatesVisible}
                onCancel={closeDuplicates}
                renderCardActions={renderDuplicatesCardActions}
                extraActions={duplicatesDialogActions}
            />
        </>
    );
};
