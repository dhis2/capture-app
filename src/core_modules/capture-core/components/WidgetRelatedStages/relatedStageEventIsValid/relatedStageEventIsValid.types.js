// @flow
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import { RelatedStageModes } from '../index';

export type RelatedStageIsValidProps = {|
    linkMode: ?$Keys<typeof RelatedStageModes>,
    scheduledAt: ?string,
    scheduledAtFormatError: ?{error: ?string, errorCode: ?string},
    orgUnit: ?{
        id: string,
        name: string,
        path: string,
    },
    linkedEventId: ?string,
    setErrorMessages: (message: ErrorMessagesForRelatedStages) => void,
|}
