// @flow
import { useCallback, useState, useRef, useEffect } from 'react';
import type { Input } from './useDuplicateCheckerOnSave.types';

export const useDuplicateCheckerOnSave = ({
    onSave,
    hasDuplicate,
    onResetPossibleDuplicates,
    onReviewDuplicates,
    searchGroup,
    duplicatesReviewPageSize,
}: Input) => {
    const [duplicatesVisible, showDuplicates] = useState(false);
    const saveRef = useRef();

    useEffect(() => onResetPossibleDuplicates, [onResetPossibleDuplicates]);

    useEffect(() => {
        if (hasDuplicate) {
            showDuplicates(true);
        }
        if (hasDuplicate === false) {
            showDuplicates(false);
            saveRef.current && saveRef.current();
        }
    }, [hasDuplicate]);

    const handleSaveAttempt = useCallback(() => {
        if (searchGroup) {
            saveRef.current = onSave;
            onReviewDuplicates(duplicatesReviewPageSize);
        } else {
            onSave();
        }
    }, [searchGroup, onSave, duplicatesReviewPageSize, onReviewDuplicates]);

    const closeDuplicates = () => {
        showDuplicates(false);
    };

    return {
        handleSaveAttempt,
        duplicatesVisible,
        closeDuplicates,
    };
};
