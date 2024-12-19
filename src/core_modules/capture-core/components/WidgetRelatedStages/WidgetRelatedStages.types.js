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
    eventId: string,
    teiId: string,
    enrollmentId: string,
    programStageId: string,
    onUpdateEnrollment: (enrollment: Object) => void,
    onUpdateEnrollmentSuccess: ({ redirect?: boolean }) => void,
    onUpdateEnrollmentError: (message: string) => void,
    onNavigateToEvent: (eventId: string) => void,
    actionsOptions?: {
        [key: $Keys<typeof relatedStageActions>]: {
            hidden?: boolean,
            disabled?: boolean,
            disabledMessage?: string
        },
    },
    ...CssClasses,
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
    displayName: string,
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
