import { useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';

export const useUserLocale = (): {
    locale: any;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
} => {
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
        locale: (data as any)?.userSettings?.settings?.keyUiLocale,
        isLoading,
        isError,
        error,
    };
};
