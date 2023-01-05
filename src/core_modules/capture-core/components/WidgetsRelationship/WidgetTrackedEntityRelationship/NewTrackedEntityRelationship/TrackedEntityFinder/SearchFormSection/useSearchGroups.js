// @flow
import { useCallback, useMemo } from 'react';
import { useMetadataApiQuery, useMetadataCustomQuery } from '../../../../../../utils/reactQueryHelpers';
import type { GetSearchGroups, GetSearchGroupsAsync, SearchGroups } from './searchFormSection.types';

export const useSearchGroups = (
    getSearchGroups?: GetSearchGroups,
    getSearchGroupsAsync?: GetSearchGroupsAsync,
    programId: string | null) => {
    const searchGroupsExternal = useMemo(() =>
        getSearchGroups && getSearchGroups(programId), [getSearchGroups, programId]);

    const getSearchGroupsExternalAsync = useCallback((): SearchGroups =>
        // $FlowFixMe will never be called if the function is undefined
        getSearchGroupsAsync(programId),
    [programId, getSearchGroupsAsync]);

    const { data: searchGroupsExternalAsync, loading: loadingExternal, failed: failedExternal } =
        useMetadataCustomQuery<SearchGroups>(
            ['WidgetSearchGroupsExternal', programId],
            getSearchGroupsExternalAsync, {
                enabled: !searchGroupsExternal && Boolean(getSearchGroupsAsync),
            },
        );

    // TODO: Incomplete
    const { data: searchGroupsInternal, loading: loadingInternal, failed: failedInternal } =
        useMetadataApiQuery<SearchGroups>(
            ['WidgetSearchGroups', programId], {
                resource: 'program',
                params: { id: '1', fields: 'id' },
            }, {
                enabled: !searchGroupsExternal && !getSearchGroupsAsync,
            },
        );

    return {
        searchGroups: searchGroupsExternal || searchGroupsExternalAsync || searchGroupsInternal,
        loading: loadingExternal || loadingInternal,
        failed: failedExternal || failedInternal,
    };
};
