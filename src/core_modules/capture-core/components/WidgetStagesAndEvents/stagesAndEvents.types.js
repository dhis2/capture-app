// @flow
import type { ProgramStage } from '../../metaData';
import type { Event, ProgramStageData } from './types/common.types';

export type Props = {|
    stages: Map<string, ProgramStage>,
    programStages: Array<ProgramStageData>,
    events: Array<Event>,
    className?: string,
|};
