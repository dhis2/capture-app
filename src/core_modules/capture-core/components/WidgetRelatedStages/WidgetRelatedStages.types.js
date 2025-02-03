// @flow
import { relatedStageActions } from './index';
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
    actionsOptions?: {
        [key: $Keys<typeof relatedStageActions>]: {
            hidden?: boolean,
            disabled?: boolean,
            disabledMessage?: string
        },
    },
|}
export type RelatedStageDataValueStates = {|
    linkMode: ?$Keys<typeof relatedStageActions>,
    scheduledAt: string,
    scheduledAtFormatError: ?{error: ?string, errorCode: ?string},
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
        linkMode: ?$Keys<typeof relatedStageActions>,
    },
    eventHasLinkableStageRelationship: () => boolean,
    formIsValidOnSave: () => boolean,
};
