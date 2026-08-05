import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryAppNamespace } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../Changelog/Changelog.constants';

const removeChangelogQueries = (
    queryClient: QueryClient,
    entityType: typeof CHANGELOG_ENTITY_TYPES[keyof typeof CHANGELOG_ENTITY_TYPES],
    entityId: string,
) => queryClient.removeQueries([ReactQueryAppNamespace, 'changelog', entityType, entityId]);

export const removeEventChangelogQueries = (queryClient: QueryClient, eventId: string) =>
    removeChangelogQueries(queryClient, CHANGELOG_ENTITY_TYPES.EVENT, eventId);

export const removeTrackedEntityChangelogQueries = (queryClient: QueryClient, teiId: string) =>
    removeChangelogQueries(queryClient, CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY, teiId);
