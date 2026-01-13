import { useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from '@tanstack/react-query';

export const useUserLocale = (): {
    locale: any;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
} => {
    const dataEngine = useDataEngine();

    const { data, isInitialLoading, isError, error } = useQuery(
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
        isLoading: isInitialLoading,
        isError,
        error,
    };
};
