import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import type { RelatedStageRefPayload } from '../../../WidgetRelatedStages';
import { relatedStageActions } from '../../../WidgetRelatedStages';

export type Props = {
    firstStageMetaData: {
        stage: ProgramStage;
    };
    formFoundation: RenderFoundation;
    orgUnit: OrgUnit | null;
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
