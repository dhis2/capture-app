import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import { relatedStageActions } from '../index';

export type RelatedStageIsValidProps = {
    linkMode: keyof typeof relatedStageActions | undefined;
    scheduledAt: string | undefined;
    scheduledAtFormatError: { error: string | null; errorCode: string | null } | undefined;
    orgUnit: {
        id: string;
        name: string;
        path: string;
    } | undefined;
    linkedEventId: string | undefined;
    setErrorMessages: (message: ErrorMessagesForRelatedStages) => void;
}
