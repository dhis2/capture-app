// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents.js';
import type { ProgramStage } from '../../metaData';
import type { ProgramStageData } from './types/common.types';

export type Props = {|
    stages: Map<string, ProgramStage>,
    programStages: Array<ProgramStageData>,
    events: Array<ApiTEIEvent>,
    className?: string,
|};
