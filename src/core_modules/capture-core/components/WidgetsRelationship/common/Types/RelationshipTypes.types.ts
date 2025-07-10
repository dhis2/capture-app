import { dataElementTypes } from '../../../../metaData';

export type ElementValue = {
    attribute?: string;
    dataElement?: string;
    displayName: string;
    valueType: string;
    value: any;
};

export type ApiTrackerDataView = Readonly<{
    attributes: readonly string[];
    dataElements: readonly string[];
}>;

type ApiCommonConstraintTypes = Readonly<{
    trackerDataView: ApiTrackerDataView;
}>;

export type ApiTrackedEntityConstraint = Readonly<{
    relationshipEntity: 'TRACKED_ENTITY_INSTANCE';
    trackedEntityType: { id: string; name: string };
    program?: { id: string; name: string };
} & ApiCommonConstraintTypes>;

export type ApiProgramStageInstanceConstraint = Readonly<{
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE';
    program: { id: string; name: string };
    programStage: { id: string; name: string };
} & ApiCommonConstraintTypes>;

export type ApiRelationshipConstraint = ApiTrackedEntityConstraint | ApiProgramStageInstanceConstraint;

export type ApiRelationshipType = Readonly<{
    id: string;
    displayName: string;
    bidirectional: boolean;
    access: {
        data: {
            read: boolean;
            write: boolean;
        };
    };
    toFromName: string;
    fromToName: string;
    fromConstraint: ApiRelationshipConstraint;
    toConstraint: ApiRelationshipConstraint;
}>;

export type ApiRelationshipTypes = readonly ApiRelationshipType[];

export type TrackerDataViewEntity = Readonly<{
    id: string;
    type: keyof typeof dataElementTypes;
    displayName: string;
    options?: Array<{ code: string; name: string }>;
}>;

export type TrackerDataView = Readonly<{
    attributes: readonly TrackerDataViewEntity[];
    dataElements: readonly TrackerDataViewEntity[];
}>;

export type CommonConstraintTypes = Readonly<{
    trackerDataView: TrackerDataView;
}>;

export type TrackedEntityConstraint = Readonly<{
    relationshipEntity: 'TRACKED_ENTITY_INSTANCE';
    trackedEntityType: { id: string; name: string };
    program?: { id: string; name: string };
} & CommonConstraintTypes>;

export type ProgramStageInstanceConstraint = Readonly<{
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE';
    program: { id: string; name: string };
    programStage: { id: string; name: string };
} & CommonConstraintTypes>;

export type RelationshipConstraint = TrackedEntityConstraint | ProgramStageInstanceConstraint;

export type RelationshipType = Readonly<{
    id: string;
    displayName: string;
    bidirectional: boolean;
    access: {
        data: {
            read: boolean;
            write: boolean;
        };
    };
    toFromName: string;
    fromToName: string;
    fromConstraint: RelationshipConstraint;
    toConstraint: RelationshipConstraint;
}>;

export type RelationshipTypes = readonly RelationshipType[];
