import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryAppNamespace } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../Changelog/Changelog.constants';

type ChangelogEntityType = typeof CHANGELOG_ENTITY_TYPES[keyof typeof CHANGELOG_ENTITY_TYPES];

const removeChangelogQueries = (
    queryClient: QueryClient,
    entityType: ChangelogEntityType,
    entityId?: string,
) => {
    const queryKey = entityId
        ? [ReactQueryAppNamespace, 'changelog', entityType, entityId]
        : [ReactQueryAppNamespace, 'changelog', entityType];
    queryClient.removeQueries(queryKey);
};

export const removeEventChangelogQueries = (queryClient: QueryClient, eventId?: string) =>
    removeChangelogQueries(queryClient, CHANGELOG_ENTITY_TYPES.EVENT, eventId);

export const removeTrackedEntityChangelogQueries = (queryClient: QueryClient, teiId: string) =>
    removeChangelogQueries(queryClient, CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY, teiId);
