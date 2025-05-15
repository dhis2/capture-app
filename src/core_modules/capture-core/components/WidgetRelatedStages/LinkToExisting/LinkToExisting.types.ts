import type {
    ErrorMessagesForRelatedStages,
    RelatedStagesEvents,
} from '../RelatedStagesActions/RelatedStagesActions.types';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';

export type LinkToExistingProps = {
    relatedStagesDataValues: RelatedStageDataValueStates;
    setRelatedStagesDataValues: (values: RelatedStageDataValueStates) => void;
    linkableEvents: Array<RelatedStagesEvents>;
    errorMessages: ErrorMessagesForRelatedStages;
    saveAttempted: boolean;
    linkableStageLabel: string;
    classes: {
        searchRow: string;
        label: string;
        singleSelectField: string;
    };
}
