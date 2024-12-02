// @flow
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';
import { RelatedStageModes } from '../index';

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

export type RelatedStagesEvents = {
    id: string,
    label: string,
    isLinkable: boolean,
    status: string,
}

export type Props = {|
    type: string,
    relationshipName: string,
    relatedStagesDataValues: RelatedStageDataValueStates,
    events: Array<RelatedStagesEvents>,
    linkableEvents: Array<RelatedStagesEvents>,
    scheduledLabel: string,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForRelatedStages,
    constraint: ?Constraint,
    addErrorMessage: (ErrorMessagesForRelatedStages) => void,
    setRelatedStagesDataValues: (() => Object) => void,
    actionTypesOptions?: {
        [key: $Keys<typeof RelatedStageModes>]: {
            hidden?: boolean,
            disabled?: boolean,
            disabledMessage?: string
        },
    },
    ...CssClasses
|}
