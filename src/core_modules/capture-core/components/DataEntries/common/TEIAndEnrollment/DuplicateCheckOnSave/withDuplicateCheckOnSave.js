// @flow
import React, { type ComponentType, useMemo } from 'react';
import { scopeTypes } from '../../../../../metaData';
import { PossibleDuplicatesDialog } from '../../../../PossibleDuplicatesDialog';
import { useDuplicateCheckerOnSaveReduxProvider } from './useDuplicateCheckerOnSaveReduxProvider';
import { useDuplicateCheckerOnSave } from './useDuplicateCheckerOnSave';
import type { Props } from './withDuplicateCheckOnSave.types';

export const withDuplicateCheckOnSave = () => (WrappedComponent: ComponentType<any>) => ({
    id,
    selectedScopeId,
    onSave,
    enrollmentMetadata,
    teiRegistrationMetadata,
    duplicatesReviewPageSize,
    renderDuplicatesCardActions,
    renderDuplicatesDialogActions,
    ...passOnProps
}: Props) => {
    const scopeType = enrollmentMetadata ? scopeTypes.TRACKER_PROGRAM : scopeTypes.TRACKED_ENTITY_TYPE;
    const metadata = enrollmentMetadata ?? teiRegistrationMetadata;

    const {
        onCheckForDuplicate,
        onResetCheckForDuplicate,
        duplicateInfo,
        onReviewDuplicates,
    } = useDuplicateCheckerOnSaveReduxProvider(id, selectedScopeId);

    const {
        handleSaveAttempt,
        duplicatesVisible,
        closeDuplicates,
    } = useDuplicateCheckerOnSave({
        onSave,
        duplicateInfo,
        onCheckForDuplicate,
        onResetCheckForDuplicate,
        onReviewDuplicates,
        searchGroup: metadata?.inputSearchGroups && metadata.inputSearchGroups[0],
        scopeType,
        selectedScopeId,
        duplicatesReviewPageSize,
    });

    const duplicatesDialogActions = useMemo(() => renderDuplicatesDialogActions && renderDuplicatesDialogActions(closeDuplicates, onSave), [
        renderDuplicatesDialogActions,
        closeDuplicates,
        onSave,
    ]);

    return (
        <>
            <WrappedComponent
                {...passOnProps}
                onSave={handleSaveAttempt}
                id={id}
                selectedScopeId={selectedScopeId}
                enrollmentMetadata={enrollmentMetadata}
                teiRegistrationMetadata={teiRegistrationMetadata}
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
