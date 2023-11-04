// @flow
import type { ReferralDataValueStates } from '../WidgetReferral.types';

type Constraint = {
    programStage: {
        id: string,
    },
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
}

export type ErrorMessagesForReferral = {|
    scheduledAt?: ?string,
    orgUnit?: ?string,
    linkedEventId?: ?string,
|}

export type LinkableEvent = {
    id: string,
    label: string,
}

export type Props = {|
    type: string,
    referralDataValues: ReferralDataValueStates,
    linkableEvents: Array<LinkableEvent>,
    scheduledLabel: string,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForReferral,
    constraint: ?Constraint,
    addErrorMessage: (ErrorMessagesForReferral) => void,
    setReferralDataValues: (() => Object) => void,
    currentStageLabel: string,
    ...CssClasses
|}
