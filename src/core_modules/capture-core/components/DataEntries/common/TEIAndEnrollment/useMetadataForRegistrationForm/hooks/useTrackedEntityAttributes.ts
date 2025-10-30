import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import { getTrackedEntityAttributes } from '../getFunctions/getTrackedEntityAttributes';

type Props = {
    selectedScopeId: string;
    attributeIds: Array<string> | null;
};

export const useTrackedEntityAttributes = ({ selectedScopeId, attributeIds }: Props) => {
    const { data: cachedTrackedEntityAttributes, isInitialLoading, isError } = useIndexedDBQuery(
        ['cachedTrackedEntityAttributes', selectedScopeId],
        () => getTrackedEntityAttributes(attributeIds ?? []),
        { enabled: !!attributeIds },
    );

    return {
        cachedTrackedEntityAttributes,
        isLoading: isInitialLoading,
        isError,
    };
};
