// @flow
import isArray from 'd2-utilizr/lib/isArray';
import { getApi } from '../d2/d2Instance';
import { getEventProgramThrowIfNotFound } from '../metaData';
import type { RelationshipType } from '../metaData';
import { convertServerRelationshipToClient } from './convertServerToClient';

async function getRelationships(queryParams: Object, relationshipTypes: Array<RelationshipType>) {
    const api = getApi();
    const apiRes = await api.get('relationships', { ...queryParams });
    return apiRes && isArray(apiRes) ? apiRes.map(rel => convertServerRelationshipToClient(rel, relationshipTypes)) : null;
}

export function getRelationshipsForEvent(eventId: string, programId: string) {
    const relationshipTypes = getEventProgramThrowIfNotFound(programId)
        .stage
        .relationshipTypes;
    return getRelationships({ event: eventId }, relationshipTypes);
}
