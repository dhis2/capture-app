// @flow
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import type { RelatedStageRefPayload } from '../../../WidgetRelatedStages';
import { RelatedStageModes } from '../../../WidgetRelatedStages';

export type Props = {
    firstStageMetaData: {
        stage: ProgramStage,
    },
    formFoundation: RenderFoundation,
    programId: string,
    relatedStageRef?: { current: ?RelatedStageRefPayload },
    relatedStageModesOptions?: {
        [key: $Keys<typeof RelatedStageModes>]: {
            hidden?: boolean,
            disabled?: boolean,
            disabledMessage?: string
        },
    },
};
