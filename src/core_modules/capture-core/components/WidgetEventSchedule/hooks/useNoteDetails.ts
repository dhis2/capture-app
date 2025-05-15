import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { generateUID } from '../../../utils/uid/generateUID';

type CurrentUser = {
    firstName: string;
    surname: string;
    username: string;
};

export const useNoteDetails = () => {
    const { data, error, loading } = useDataQuery<{ currentUser: CurrentUser }>(useMemo(() => ({
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
        currentUser: !loading && data?.currentUser,
        noteId: generateUID(),
    };
};
