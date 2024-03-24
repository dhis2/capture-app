// @flow

import type { ErrorMessagesForRelatedStages, LinkableEvent } from '../RelatedStagesActions/RelatedStagesActions.types';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

export type LinkToExistingProps = {|
    relatedStagesDataValues: RelatedStageDataValueStates,
    setRelatedStagesDataValues: (RelatedStageDataValueStates) => void,
    linkableEvents: Array<LinkableEvent>,
    errorMessages: ErrorMessagesForRelatedStages,
    saveAttempted: boolean,
    linkableStageLabel: string,
    ...CssClasses,
|}
