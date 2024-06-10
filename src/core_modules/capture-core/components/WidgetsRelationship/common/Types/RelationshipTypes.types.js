// @flow
import { dataElementTypes } from '../../../../metaData';

export type ElementValue = {|
    attribute?: string,
    dataElement?: string,
    displayName: string,
    valueType: string,
    value: any,
|};

export type ApiTrackerDataView = $ReadOnly<{|
    attributes: $ReadOnlyArray<string>,
    dataElements: $ReadOnlyArray<string>,
|}>;

type ApiCommonConstraintTypes = $ReadOnly<{|
    trackerDataView: ApiTrackerDataView,
|}>;

export type ApiTrackedEntityConstraint = $ReadOnly<{|
    ...ApiCommonConstraintTypes,
    relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
    trackedEntityType: { id: string, name: string },
    program?: { id: string, name: string },
|}>;

export type ApiProgramStageInstanceConstraint = $ReadOnly<{|
    ...ApiCommonConstraintTypes,
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
    program: { id: string, name: string },
    programStage: { id: string, name: string },
|}>;

export type ApiRelationshipConstraint = ApiTrackedEntityConstraint | ApiProgramStageInstanceConstraint;

export type ApiRelationshipType = $ReadOnly<{|
    id: string,
    displayName: string,
    bidirectional: boolean,
    access: Object,
    toFromName: string,
    fromToName: string,
    fromConstraint: ApiRelationshipConstraint,
    toConstraint: ApiRelationshipConstraint,
|}>;

export type ApiRelationshipTypes = $ReadOnlyArray<ApiRelationshipType>;

export type TrackerDataViewEntity = $ReadOnly<{|
    id: string,
    type: $Keys<typeof dataElementTypes>,
    displayName: string,
    options?: Array<{ code: string, name: string }>,
|}>;

export type TrackerDataView = $ReadOnly<{|
    attributes: $ReadOnlyArray<TrackerDataViewEntity>,
    dataElements: $ReadOnlyArray<TrackerDataViewEntity>,
|}>;

export type CommonConstraintTypes = $ReadOnly<{|
    trackerDataView: TrackerDataView,
|}>;

export type TrackedEntityConstraint = $ReadOnly<{|
    ...CommonConstraintTypes,
    relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
    trackedEntityType: { id: string, name: string },
    program?: { id: string, name: string },
|}>;

export type ProgramStageInstanceConstraint = $ReadOnly<{|
    ...CommonConstraintTypes,
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
    program: { id: string, name: string },
    programStage: { id: string, name: string },
|}>;

export type RelationshipConstraint = TrackedEntityConstraint | ProgramStageInstanceConstraint;

export type RelationshipType = $ReadOnly<{|
    id: string,
    displayName: string,
    bidirectional: boolean,
    access: Object,
    toFromName: string,
    fromToName: string,
    fromConstraint: RelationshipConstraint,
    toConstraint: RelationshipConstraint,
|}>;

export type RelationshipTypes = $ReadOnlyArray<RelationshipType>;
