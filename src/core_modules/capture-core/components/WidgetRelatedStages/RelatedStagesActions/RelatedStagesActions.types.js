// @flow
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

export type Constraint = {|
    programStage: {
        id: string,
        program: {
            id: string,
        },
    },
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
|}

export type ErrorMessagesForRelatedStages = {|
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
    relationshipName: string,
    relatedStagesDataValues: RelatedStageDataValueStates,
    linkableEvents: Array<LinkableEvent>,
    scheduledLabel: string,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForRelatedStages,
    constraint: ?Constraint,
    addErrorMessage: (ErrorMessagesForRelatedStages) => void,
    setRelatedStagesDataValues: (() => Object) => void,
    currentStageLabel: string,
    ...CssClasses
|}
