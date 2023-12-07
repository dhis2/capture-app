// @flow

import { useApiMetadataQuery } from '../../../../../utils/reactQueryHelpers';

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
            select: enrollmentPageConfig => enrollmentPageConfig[selectedScopeId],
        },
    );

    return {
        customPageLayoutConfig: data,
        isLoading,
        isError,
    };
};
