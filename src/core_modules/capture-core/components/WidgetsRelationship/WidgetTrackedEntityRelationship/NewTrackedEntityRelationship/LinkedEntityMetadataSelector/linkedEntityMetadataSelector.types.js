// @flow
import type { TargetSides } from '../MOVE_WidgetsCommon';

type TeiConstraint = $ReadOnly<{
    relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
    program?: { id: string },
    trackedEntityType: { id: string },
}>;

type OtherConstraint = $ReadOnly<{
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE' | 'PROGRAM_INSTANCE',
}>;

type RelationshipTypeUnidirectional = $ReadOnly<{
    id: string,
    displayName: string,
    bidirectional: false,
    fromToName: string,
    toFromName: void,
    fromConstraint: TeiConstraint | OtherConstraint,
    toConstraint: TeiConstraint | OtherConstraint,
}>;

type RelationshipTypeBidirectional = $ReadOnly<{
    id: string,
    displayName: string,
    bidirectional: true,
    fromToName: string,
    toFromName: string,
    fromConstraint: TeiConstraint | OtherConstraint,
    toConstraint: TeiConstraint | OtherConstraint,
}>;

export type RelationshipType = RelationshipTypeUnidirectional | RelationshipTypeBidirectional;

export type RelationshipTypes = $ReadOnlyArray<RelationshipType>;

export type Side = $ReadOnly<{|
    trackedEntityTypeId: string,
    programId?: string,
    name: string,
    targetSide: TargetSides,
|}>;

export type ApplicableTypeInfo = $ReadOnly<{|
    id: string,
    name: string,
    sides: $ReadOnlyArray<Side>,
|}>;

export type ApplicableTypesInfo = $ReadOnlyArray<ApplicableTypeInfo>;

export type LinkedEntityMetadata = $ReadOnly<{|
    trackedEntityTypeId: string,
    programId: string,
    name: string,
    targetSide: TargetSides,
    relationshipId: string,
|}>;

export type Props = $ReadOnly<{|
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSelectLinkedEntityMetadata: (linkedEntityMetadata: LinkedEntityMetadata) => void,

|}>;
