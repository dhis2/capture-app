// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents.js';
import type { ProgramStage } from 'capture-core/metaData';
import type { ProgramStageData } from '../../types/common.types';

export type Props = {|
    stage: ProgramStage,
    events: Array<ApiTEIEvent>,
    programStage: ProgramStageData,
    className?: string,
    ...CssClasses,
|};
