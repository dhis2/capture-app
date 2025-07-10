import type {
    ErrorMessagesForRelatedStages,
    RelatedStagesEvents,
} from '../RelatedStagesActions/RelatedStagesActions.types';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

export type LinkToExistingProps = {
    relatedStagesDataValues: RelatedStageDataValueStates;
    setRelatedStagesDataValues: (updater: any) => void;
    linkableEvents: Array<RelatedStagesEvents>;
    errorMessages: ErrorMessagesForRelatedStages;
    saveAttempted: boolean;
    linkableStageLabel: string;
};
