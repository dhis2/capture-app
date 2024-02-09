// @flow
import { useApiMetadataQuery } from '../../../../../../utils/reactQueryHelpers';
import type { PageLayoutConfig } from '../DefaultEnrollmentLayout.types';

type Props = {
    selectedScopeId: ?string,
    defaultPageLayout: PageLayoutConfig,
    dataStoreKey: string,
}
export const useEnrollmentPageLayout = ({ selectedScopeId, defaultPageLayout, dataStoreKey }: Props) => {
    const { data, isLoading, isError } = useApiMetadataQuery(
        ['customEnrollmentPageLayout'],
        {
            resource: 'dataStore/capture?fields=.',
        },
        {
            enabled: !!selectedScopeId,
            select: (captureDataStore: any) => {
                const { entries } = captureDataStore ?? {};
                const enrollmentPageConfig = entries?.find(({ key }) => key === dataStoreKey)?.value;
                const enrollmentPageConfigForScope: ?PageLayoutConfig = enrollmentPageConfig?.[selectedScopeId];

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
        isLoading,
        isError,
    };
};
