// @flow
import { useEffect } from 'react';


export const useSavingInProgress = (
    handleAssignUid: () => void,
    handleRemoveUid: () => void,
) => {
    useEffect(() => {
        handleAssignUid();
        return () => {
            handleRemoveUid();
        };
    }, [handleAssignUid, handleRemoveUid]);
};
