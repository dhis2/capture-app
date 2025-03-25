import { useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';

type UserSettingsResponse = {
    userSettings?: {
        settings?: {
            keyUiLocale?: string;
        };
    };
};

type UseUserLocaleResult = {
    locale?: string;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
};

export const useUserLocale = (): UseUserLocaleResult => {
    const dataEngine = useDataEngine();

    const { data, isLoading, isError, error } = useQuery<UserSettingsResponse>(
        ['userLocale'],
        () => dataEngine.query({
            userSettings: {
                resource: 'me',
                params: {
                    fields: 'settings[keyUiLocale]',
                },
            },
        })
    );

    return {
        locale: data?.userSettings?.settings?.keyUiLocale,
        isLoading,
        isError,
        error,
    };
};
