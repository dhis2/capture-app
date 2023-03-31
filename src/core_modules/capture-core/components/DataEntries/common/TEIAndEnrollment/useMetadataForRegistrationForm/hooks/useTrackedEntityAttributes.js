// @flow
import { useIndexedDBQuery } from '../../../../../../utils/reactQueryHelpers';
import { getTrackedEntityAttributes } from '../getFunctions/getTrackedEntityAttributes';

type Props = {
    selectedScopeId: string,
    attributeIds: ?Array<string>,
};

export const useTrackedEntityAttributes = ({ selectedScopeId, attributeIds }: Props) => {
    const { data: cachedTrackedEntityAttributes, isLoading, isError } = useIndexedDBQuery(
        ['cachedTrackedEntityAttributes', selectedScopeId],
        // $FlowFixMe
        () => getTrackedEntityAttributes(attributeIds),
        { enabled: !!attributeIds },
    );

    return {
        cachedTrackedEntityAttributes,
        isLoading,
        isError,
    };
};
