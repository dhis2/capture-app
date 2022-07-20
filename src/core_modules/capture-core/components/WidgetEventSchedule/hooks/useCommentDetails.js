// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import uuid from 'd2-utilizr/lib/uuid';

export const useCommentDetails = () => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        currentUser: {
            resource: 'me',
            params: {
                fields:
                ['firstName,surname,username'],
            },
        },
    }), []));


    return {
        error,
        currentUser: !loading && data.currentUser,
        noteId: uuid(),
    };
};
