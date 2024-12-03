// @flow
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import { actions as LinkModes } from '../constants';

export type RelatedStageIsValidProps = {|
    linkMode: ?$Keys<typeof LinkModes>,
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
