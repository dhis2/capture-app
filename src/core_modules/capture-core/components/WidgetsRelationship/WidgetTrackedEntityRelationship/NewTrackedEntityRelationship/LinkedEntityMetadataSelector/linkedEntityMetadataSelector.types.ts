import type { RelationshipTypes } from '../../../common/Types';
import type { TargetSides } from '../../../common/LinkedEntityMetadataSelector';

export type Side = {
    readonly trackedEntityTypeId: string;
    readonly trackedEntityName: string;
    readonly programId?: string;
    readonly name: string;
    readonly targetSide: TargetSides;
};

export type ApplicableTypeInfo = {
    readonly id: string;
    readonly name: string;
    readonly sides: readonly Side[];
};

export type ApplicableTypesInfo = readonly ApplicableTypeInfo[];

export type LinkedEntityMetadata = {
    readonly trackedEntityTypeId: string;
    readonly programId: string;
    readonly name: string;
    readonly targetSide: TargetSides;
    readonly relationshipId: string;
    readonly trackedEntityName: string;
};

export type Props = {
    readonly relationshipTypes: RelationshipTypes;
    readonly trackedEntityTypeId: string;
    readonly programId: string;
    readonly onSelectLinkedEntityMetadata: (linkedEntityMetadata: LinkedEntityMetadata) => void;
};
