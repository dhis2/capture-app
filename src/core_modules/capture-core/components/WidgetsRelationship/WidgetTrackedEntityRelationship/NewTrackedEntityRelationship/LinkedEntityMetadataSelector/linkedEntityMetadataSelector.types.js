// @flow
import type { RelationshipTypes } from '../../../common/Types';
import type { TargetSides } from '../../../common/LinkedEntityMetadataSelector';


export type Side = $ReadOnly<{|
    trackedEntityTypeId: string,
    trackedEntityName: string,
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
    trackedEntityName: string,
|}>;

export type Props = $ReadOnly<{|
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSelectLinkedEntityMetadata: (linkedEntityMetadata: LinkedEntityMetadata) => void,

|}>;
