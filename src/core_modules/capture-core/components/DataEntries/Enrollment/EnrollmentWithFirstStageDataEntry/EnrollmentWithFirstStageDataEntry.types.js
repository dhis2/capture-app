// @flow
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import type { RelatedStageRefPayload } from '../../../WidgetRelatedStages';
import { relatedStageActions } from '../../../WidgetRelatedStages';

export type Props = {
    firstStageMetaData: {
        stage: ProgramStage,
    },
    formFoundation: RenderFoundation,
    programId: string,
    relatedStageRef?: { current: ?RelatedStageRefPayload },
    relatedStageActionsOptions?: {
        [key: $Keys<typeof relatedStageActions>]: {
            hidden?: boolean,
            disabled?: boolean,
            disabledMessage?: string
        },
    },
};
