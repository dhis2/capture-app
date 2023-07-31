// @flow
import { ProgramStage } from '../../../../../../metaData';

export type SaveForDuplicateCheck = (firstStageMetaData?: { stage: ProgramStage }) => void;
