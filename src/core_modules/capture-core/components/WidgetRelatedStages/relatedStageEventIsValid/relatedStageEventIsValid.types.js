// @flow
import type { ErrorMessagesForRelatedStages } from '../RelatedStagesActions';
import { actions as RelatedStagesModes } from '../constants';

export type RelatedStageIsValidProps = {|
    linkMode: $Keys<typeof RelatedStagesModes>,
    scheduledAt: ?string,
    orgUnit: ?{
        id: string,
        name: string,
        path: string,
    },
    linkedEventId: ?string,
    setErrorMessages: (message: ErrorMessagesForRelatedStages) => void,
|}
