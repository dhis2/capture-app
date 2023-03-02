import { useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';

export const useUserLocale = () => {
    const dataEngine = useDataEngine();

    const { data, isLoading, isError, error } = useQuery(
        ['userLocale'],
        () => dataEngine.query({
            userSettings: {
                resource: 'me',
                params: {
                    fields: 'settings[keyUiLocale]',
                },
            },
        }));

    return {
        locale: data?.userSettings?.settings?.keyUiLocale,
        isLoading,
        isError,
        error,
    };
};
