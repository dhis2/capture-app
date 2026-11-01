import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import type { RelatedStageRefPayload } from '../../../WidgetRelatedStages';
import { relatedStageActions } from '../../../WidgetRelatedStages';

export type Props = {
    firstStageMetaData: {
        stage: ProgramStage;
    };
    formFoundation: RenderFoundation;
    stageOrgUnitIdFieldValue?: string;
    programId: string;
    relatedStageRef?: { current: RelatedStageRefPayload | null },
    relatedStageActionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
};
