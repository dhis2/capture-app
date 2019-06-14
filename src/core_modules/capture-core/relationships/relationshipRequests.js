// @flow
import isArray from 'd2-utilizr/lib/isArray';
import { getApi } from '../d2/d2Instance';
import {
    RelationshipType,
    getEventProgramThrowIfNotFound,
} from '../metaData';
import convertServerToClient from './convertServerToClient';

async function getRelationships(queryParams: Object, relationshipTypes: Array<RelationshipType>) {
    const api = getApi();
    const apiRes = await api.get('relationships', { ...queryParams });
    return apiRes && isArray(apiRes) ? apiRes.map(rel => convertServerToClient(rel, relationshipTypes)) : null;
}

export function getRelationshipsForEvent(eventId: string, programId: string) {
    const relationshipTypes = getEventProgramThrowIfNotFound(programId)
        .getStageThrowIfNull()
        .relationshipTypes;
    return getRelationships({ event: eventId }, relationshipTypes);
}
