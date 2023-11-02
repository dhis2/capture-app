// @flow
import type { ReferralDataValueStates } from '../WidgetReferral.types';

type ReferralRelationshipType = {|
    id: string,
    fromConstraint: {
        entity: string,
        programStageId?: {
            id: string,
        }
    },
    toConstraint: {
        programStage?: {
            id: string,
        },
    },
|}

type Constraint = {
    programStage: {
        id: string,
    },
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
}

export type ErrorMessagesForReferral = {|
    scheduledAt?: ?string,
    orgUnit?: ?string,
|}

export type Props = {|
    type: string,
    selectedType: ReferralRelationshipType,
    referralDataValues: ReferralDataValueStates,
    scheduledLabel: string,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForReferral,
    constraint: ?Constraint,
    addErrorMessage: (ErrorMessagesForReferral) => void,
    setReferralDataValues: (() => Object) => void,
    currentStageLabel: string,
    ...CssClasses
|}
