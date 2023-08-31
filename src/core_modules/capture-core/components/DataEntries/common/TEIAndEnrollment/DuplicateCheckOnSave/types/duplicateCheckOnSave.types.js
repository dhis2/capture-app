// @flow
import { ProgramStage, RenderFoundation } from '../../../../../../metaData';

export type SaveForDuplicateCheck = (
    formFoundation?: RenderFoundation,
    firstStageMetaData?: { stage: ProgramStage },
) => void;
