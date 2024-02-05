// @flow
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { getProgramThrowIfNotFound, EventProgram } from '../metaData';
import type { RelationshipType } from '../metaData';
import type { QuerySingleResource } from '../utils/api/api.types';

import { convertServerRelationshipToClient } from './convertServerToClient';

async function getRelationships(
    queryParams: Object,
    relationshipTypes: Array<RelationshipType>,
    querySingleResource: QuerySingleResource,
) {
    const apiResponse = await querySingleResource({
        resource: 'tracker/relationships',
        params: queryParams,
    });
    const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, apiResponse);
    // $FlowFixMe[missing-annot]
    return apiRelationships.map(rel => convertServerRelationshipToClient(rel, relationshipTypes));
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
        { event: eventId, fields: ['from,to,relationshipType,relationship,createdAt'] },
        relationshipTypes,
        querySingleResource,
    );
}
