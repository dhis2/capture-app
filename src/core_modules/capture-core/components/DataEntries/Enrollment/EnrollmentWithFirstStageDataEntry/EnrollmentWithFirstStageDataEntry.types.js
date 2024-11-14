// @flow
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import type { RelatedStageRefPayload } from '../../../WidgetRelatedStages';

export type Props = {
    firstStageMetaData: {
        stage: ProgramStage,
    },
    formFoundation: RenderFoundation,
    programId: string,
    relatedStageRef?: { current: ?RelatedStageRefPayload },
};
