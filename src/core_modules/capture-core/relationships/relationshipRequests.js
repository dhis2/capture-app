// @flow
import isArray from 'd2-utilizr/lib/isArray';
import { getApi } from '../d2/d2Instance';
import { EventProgram, getProgramFromProgramIdThrowIfNotFound } from '../metaData';
import type { RelationshipType } from '../metaData';
import { convertServerRelationshipToClient } from './convertServerToClient';

async function getRelationships(queryParams: Object, relationshipTypes: Array<RelationshipType>) {
    const api = getApi();
    const apiRes = await api.get('relationships', { ...queryParams });
    return apiRes && isArray(apiRes) ? apiRes.map(rel => convertServerRelationshipToClient(rel, relationshipTypes)) : null;
}

export function getRelationshipsForEvent(eventId: string, programId: string, programStageId: string) {
    const program = getProgramFromProgramIdThrowIfNotFound(programId);
    const stage = program instanceof EventProgram ? program.stage : program.getStage(programStageId);
    const relationshipTypes = stage?.relationshipTypes || [];
    return getRelationships({ event: eventId }, relationshipTypes);
}
