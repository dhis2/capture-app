// @flow
import { useMemo } from 'react';
import log from 'loglevel';
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes } from '../../../../metaData';
import { RELATIONSHIP_ENTITIES } from '../constants';
import { convertClientToList, convertServerToClient } from '../../../../converters';
import type { GroupedLinkedEntities, LinkedEntityData } from './types';
import type { ApiLinkedEntity, InputRelationshipData, RelationshipTypes } from '../Types';


const getFallbackFieldsByRelationshipEntity = {
    [RELATIONSHIP_ENTITIES.TRACKED_ENTITY_INSTANCE]: () => [{
        id: 'trackedEntityTypeName',
        displayName: i18n.t('Type'),
        convertValue: trackedEntityTypeName => trackedEntityTypeName,
    }, {
        id: 'relationshipCreatedAt',
        displayName: i18n.t('Created date'),
        convertValue: createdDate => convertClientToList(
            convertServerToClient(createdDate, dataElementTypes.DATE), dataElementTypes.DATE,
        ),
    }],
    [RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE]: () => [{
        id: 'programStageName',
        displayName: i18n.t('Program stage name'),
        convertValue: programStageName => programStageName,
    },
    {
        id: 'relationshipCreatedAt',
        displayName: i18n.t('Created date'),
        convertValue: createdDate => convertClientToList(
            convertServerToClient(createdDate, dataElementTypes.DATE), dataElementTypes.DATE,
        ),
    }],
};

const getColumns = ({ relationshipEntity, trackerDataView }) => {
    let fields;
    if (relationshipEntity === RELATIONSHIP_ENTITIES.TRACKED_ENTITY_INSTANCE) {
        fields = trackerDataView.attributes;
    } else if (relationshipEntity === RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE) {
        fields = trackerDataView.dataElements;
    }

    if (!fields?.length) {
        fields = getFallbackFieldsByRelationshipEntity[relationshipEntity]();
    }

    return fields;
};

// $FlowFixMe destructering
const getContext = ({ relationshipEntity, program, programStage, trackedEntityType }, access) => {
    if (relationshipEntity === RELATIONSHIP_ENTITIES.TRACKED_ENTITY_INSTANCE) {
        return {
            navigation: {
                programId: program?.id,
            },
            display: {
                trackedEntityTypeName: trackedEntityType.name,
                showDeleteButton: access.data.write,
            },
        };
    }

    if (relationshipEntity === RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE) {
        return {
            navigation: {},
            display: {
                programStageName: programStage.name,
                showDeleteButton: access.data.write && false,
            },
        };
    }

    return {
        navigation: {},
        display: {},
    };
};

const getEventData = ({ dataValues, event, program: programId }, { relationshipCreatedAt, relationshipId }, pendingApiResponse): LinkedEntityData => {
    const values = dataValues.reduce((acc, dataValue) => {
        acc[dataValue.dataElement] = dataValue.value;
        return acc;
    }, {});

    return {
        id: event,
        values,
        baseValues: {
            relationshipCreatedAt,
            relationshipId,
            pendingApiResponse,
        },
        navigation: {
            eventId: event,
            programId,
        },
    };
};

const getTrackedEntityData = ({ attributes, trackedEntity }, { relationshipCreatedAt, relationshipId }, pendingApiResponse?: boolean): LinkedEntityData => {
    const values = attributes.reduce((acc, attribute) => {
        acc[attribute.attribute] = attribute.value;
        return acc;
    }, {});

    return {
        id: trackedEntity,
        values,
        baseValues: {
            pendingApiResponse,
            relationshipCreatedAt,
            relationshipId,
        },
        navigation: {
            trackedEntityId: trackedEntity,
        },
    };
};

const getLinkedEntityData = (apiLinkedEntity, relationshipMeta, pendingApiResponse) => {
    if (apiLinkedEntity.trackedEntity) {
        return getTrackedEntityData(apiLinkedEntity.trackedEntity, relationshipMeta, pendingApiResponse);
    }

    if (apiLinkedEntity.event) {
        return getEventData(apiLinkedEntity.event, relationshipMeta, pendingApiResponse);
    }

    if (apiLinkedEntity.enrollment) {
        log.warn(errorCreator('Linked entities of type enrollment are not currently supported')({ apiLinkedEntity }));
        return null;
    }

    log.error(errorCreator('Unsupported linked entity type')({ apiLinkedEntity }));
    return null;
};

export const determineLinkedEntity =
    (fromEntity: ApiLinkedEntity, toEntity: ApiLinkedEntity, sourceId: string): ApiLinkedEntity | null => {
        if (fromEntity.trackedEntity?.trackedEntity === sourceId || fromEntity.event?.event === sourceId) {
            return toEntity;
        }

        if (toEntity.trackedEntity?.trackedEntity === sourceId || toEntity.event?.event === sourceId) {
            return fromEntity;
        }

        log.error(errorCreator('Could not determine linked entity')({ fromEntity, toEntity, sourceId }));
        return null;
    };

export const useGroupedLinkedEntities = (
    sourceId: string,
    relationshipTypes: ?RelationshipTypes,
    relationships?: Array<InputRelationshipData>,
): GroupedLinkedEntities => useMemo(() => {
    if (!relationships?.length || !relationshipTypes?.length) {
        return [];
    }

    return relationships
        .sort((a, b) => moment(b.createdAt)
            .diff(moment(a.createdAt)))
        .reduce((accGroupedLinkedEntities, relationship) => {
            const {
                relationship: relationshipId,
                relationshipType: relationshipTypeId,
                from: fromEntity,
                to: toEntity,
                pendingApiResponse,
                createdAt: relationshipCreatedAt,
            } = relationship;

            const relationshipType = relationshipTypes.find(type => type.id === relationshipTypeId);
            if (!relationshipType) {
                log.error(
                    errorCreator('Could not find relationshipType')({ relationshipTypeId, relationshipTypes }),
                );
                return accGroupedLinkedEntities;
            }

            const apiLinkedEntity = determineLinkedEntity(fromEntity, toEntity, sourceId);
            if (!apiLinkedEntity) {
                return accGroupedLinkedEntities;
            }

            if (!relationshipType.bidirectional && apiLinkedEntity === fromEntity) {
                return accGroupedLinkedEntities;
            }

            const linkedEntityData = getLinkedEntityData(
                apiLinkedEntity,
                { relationshipCreatedAt, relationshipId },
                pendingApiResponse);
            if (!linkedEntityData) {
                return accGroupedLinkedEntities;
            }

            const groupId = `${relationshipTypeId}-${apiLinkedEntity === fromEntity ? 'from' : 'to'}`;
            const group = accGroupedLinkedEntities.find(({ id }) => id === groupId);
            if (group) {
                group.linkedEntities = [
                    ...group.linkedEntities,
                    linkedEntityData,
                ];
            } else {
                const { constraint, name } = apiLinkedEntity === fromEntity ?
                    { constraint: relationshipType.fromConstraint, name: relationshipType.toFromName } :
                    { constraint: relationshipType.toConstraint, name: relationshipType.fromToName };

                const columns = getColumns(constraint);
                const context = getContext(constraint, relationshipType.access);

                accGroupedLinkedEntities.push({
                    id: groupId,
                    name: name || relationshipType.displayName,
                    linkedEntities: [linkedEntityData],
                    columns,
                    context,
                });
            }

            return accGroupedLinkedEntities;
        }, []);
}, [relationships, relationshipTypes, sourceId]);
