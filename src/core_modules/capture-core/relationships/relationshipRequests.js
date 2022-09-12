// @flow
import isArray from 'd2-utilizr/lib/isArray';
import { getProgramThrowIfNotFound, EventProgram } from '../metaData';
import type { RelationshipType } from '../metaData';
import type { QuerySingleResource } from '../utils/api/api.types';

import { convertServerRelationshipToClient } from './convertServerToClient';

async function getRelationships(
    queryParams: Object,
    relationshipTypes: Array<RelationshipType>,
    querySingleResource: QuerySingleResource,
) {
    const apiRes = await querySingleResource({
        resource: 'tracker/relationships',
        params: queryParams,
    });
    return apiRes?.instances && isArray(apiRes.instances) ? apiRes.instances?.map(rel => convertServerRelationshipToClient(rel, relationshipTypes)) : null;
}

export function getRelationshipsForEvent(
    eventId: string,
    programId: string,
    programStageId: string,
    querySingleResource: QuerySingleResource,
) {
    const program = getProgramThrowIfNotFound(programId);
    const stage = program instanceof EventProgram ? program.stage : program.getStage(programStageId);
    const relationshipTypes = stage?.relationshipTypes || [];
    return getRelationships(
        { event: eventId, fields: ['from,to,relationshipType,relationship'] },
        relationshipTypes,
        querySingleResource,
    );
}
