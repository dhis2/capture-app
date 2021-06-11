// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { ProgramStage } from '../../../metaData';
import type { ProgramStageData } from '../types/common.types';

export type Props = {|
    stages: Map<string, ProgramStage>,
    events: Array<ApiTEIEvent>,
    programStages: Array<ProgramStageData>,
    ...CssClasses,
|};
