// @flow
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';


export const useBlockNavigation = (
    handleAssignUid: () => void,
    handleRemoveUid: (location?: Object) => void,
) => {
    const history = useHistory();
    const isSavingInProgress = useSelector(({ possibleDuplicates }) =>
        possibleDuplicates.isLoading || possibleDuplicates.isUpdating);

    useEffect(() => {
        const unblock = history.block((location) => {
            if (isSavingInProgress) {
                handleRemoveUid(location);
                // $FlowFixMe
                return false;
            }
            // $FlowFixMe
            return true;
        });

        return () => {
            unblock && unblock();
        };
    }, [history, isSavingInProgress, handleRemoveUid]);

    useEffect(() => {
        handleAssignUid();
        return () => {
            handleRemoveUid();
        };
    }, [handleAssignUid, handleRemoveUid]);
};
