import { useApiMetadataQuery } from '../../../../../../utils/reactQueryHelpers';
import type { PageLayoutConfig } from '../DefaultEnrollmentLayout.types';

type Props = {
    selectedScopeId: string | null,
    defaultPageLayout: PageLayoutConfig,
    dataStoreKey: string,
}
export const useEnrollmentPageLayout = ({ selectedScopeId, defaultPageLayout, dataStoreKey }: Props) => {
    const { data, isInitialLoading, isError } = useApiMetadataQuery(
        ['customEnrollmentPageLayout'],
        {
            resource: 'dataStore/capture?fields=.',
        },
        {
            enabled: !!selectedScopeId,
            select: (captureDataStore: any) => {
                const { entries } = captureDataStore ?? {};
                const enrollmentPageConfig = entries?.find(({ key }: any) => key === dataStoreKey)?.value;
                const enrollmentPageConfigForScope: PageLayoutConfig | null = selectedScopeId ? enrollmentPageConfig?.[selectedScopeId] : null;

                if (!enrollmentPageConfigForScope) return defaultPageLayout;

                const { leftColumn, rightColumn } = enrollmentPageConfigForScope;

                if (!leftColumn && !rightColumn) {
                    throw new Error('Invalid enrollment page layout configuration');
                }

                return enrollmentPageConfigForScope;
            },
        },
    );

    return {
        pageLayout: data,
        isLoading: isInitialLoading,
        isError,
    };
};
