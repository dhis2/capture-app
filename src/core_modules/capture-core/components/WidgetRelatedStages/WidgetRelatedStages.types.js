// @flow
import { RelatedStageModes } from './index';
import type { Constraint } from './RelatedStagesActions/RelatedStagesActions.types';

export type RelationshipType = {|
    fromConstraint: Constraint,
    toConstraint: Constraint,
    bidirectional: boolean,
    displayName: string,
    id: string,
    access: {
        data: {
            write: boolean,
        }
    }
|}

export type Props = {|
    programId: string,
    enrollmentId?: string,
    programStageId: string,
    enableLinkExistingEvent?: boolean,
|}
export type RelatedStageDataValueStates = {|
    linkMode: ?$Keys<typeof RelatedStageModes>,
    scheduledAt: string,
    orgUnit: ?{
        path: string,
        id: string,
        name: string,
    },
    linkedEventId: ?string,
|}

export type RelatedStageRelationshipType = {|
    id: string,
    fromConstraint: {|
        programStage: {
            id: string,
        },
    |},
    toConstraint: {
        programStage: {
            id: string,
        },
    }
|}

export type RelatedStageRefPayload = {
    getLinkedStageValues: () => {
        selectedRelationshipType: RelatedStageRelationshipType,
        relatedStageDataValues: RelatedStageDataValueStates,
        linkMode: ?$Keys<typeof RelatedStageModes>,
    },
    eventHasLinkableStageRelationship: () => boolean,
    formIsValidOnSave: () => boolean,
};
