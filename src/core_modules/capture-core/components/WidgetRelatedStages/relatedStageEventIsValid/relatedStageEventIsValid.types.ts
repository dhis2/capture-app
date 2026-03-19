import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import { relatedStageActions } from '../index';

export type RelatedStageIsValidProps = {
    linkMode?: keyof typeof relatedStageActions;
    scheduledAt?: string;
    scheduledAtFormatError?: { error?: string; errorCode?: string };
    orgUnit?: {
        id: string;
        name: string;
        path: string;
    };
    linkedEventId?: string;
    setErrorMessages: (message: ErrorMessagesForRelatedStages) => void;
    expiryPeriod?: {
        expiryPeriodType?: string;
        expiryDays?: number;
    };
};
