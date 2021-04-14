// @flow
import { useCallback, useState, useRef, useEffect } from 'react';
import { scopeTypes } from '../../../../../metaData';
import type { Input } from './useDuplicateCheckerOnSave.types';

const useCheckForDuplicate = ({
    onCheckForDuplicate,
    searchGroup,
    scopeType,
    selectedScopeId,
}) => {
    if (!searchGroup) {
        return undefined;
    }

    const scopePropertyName: string = scopeType === scopeTypes.TRACKED_ENTITY_TYPE ? 'trackedEntityTypeId' : 'programId';
    return () => onCheckForDuplicate(
        searchGroup, {
            [scopePropertyName]: selectedScopeId,
        });
};

export const useDuplicateCheckerOnSave = ({
    onSave,
    duplicateInfo,
    onCheckForDuplicate,
    onResetCheckForDuplicate,
    onReviewDuplicates,
    searchGroup,
    scopeType,
    selectedScopeId,
    duplicatesReviewPageSize,
}: Input) => {
    const [duplicatesVisible, showDuplicates] = useState(false);
    const saveRef = useRef();

    const checkForDuplicate = useCheckForDuplicate({
        onCheckForDuplicate,
        searchGroup,
        scopeType,
        selectedScopeId,
    });
    useEffect(() => {
        if (duplicateInfo) {
            if (duplicateInfo.hasDuplicate) {
                onReviewDuplicates(duplicatesReviewPageSize);
                showDuplicates(true);
            } else {
                saveRef.current && saveRef.current();
            }
        }

        return onResetCheckForDuplicate;
    }, [duplicateInfo, onResetCheckForDuplicate, onReviewDuplicates, duplicatesReviewPageSize]);

    const handleSaveAttempt = useCallback(() => {
        if (checkForDuplicate) {
            saveRef.current = onSave;
            checkForDuplicate();
        } else {
            onSave();
        }
    }, [checkForDuplicate, onSave]);

    const closeDuplicates = () => {
        showDuplicates(false);
    };

    return {
        handleSaveAttempt,
        duplicatesVisible,
        closeDuplicates,
    };
};
