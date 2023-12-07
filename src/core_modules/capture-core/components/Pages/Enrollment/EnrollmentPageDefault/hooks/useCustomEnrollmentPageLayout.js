// @flow
import { useApiMetadataQuery } from '../../../../../utils/reactQueryHelpers';
import type { CustomPageLayoutConfig } from '../CustomEnrollmentPageLayout/CustomEnrollmentPageLayout.types';

type Props = {
    selectedScopeId: string,
}
export const useCustomEnrollmentPageLayout = ({ selectedScopeId }: Props) => {
    const { data, isLoading, isError } = useApiMetadataQuery(
        ['customEnrollmentPageLayout'],
        {
            resource: 'dataStore/capture/enrollmentPageLayout',
        },
        {
            enabled: !!selectedScopeId,
            select: (enrollmentPageConfig) => {
                if (!enrollmentPageConfig) return null;
                const enrollmentPageConfigForScope: ?CustomPageLayoutConfig = enrollmentPageConfig[selectedScopeId];

                return enrollmentPageConfigForScope;
            },
        },
    );

    return {
        customPageLayoutConfig: !isError ? data : undefined,
        isLoading,
        isError,
    };
};
