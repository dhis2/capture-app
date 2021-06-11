// @flow
import type { Program } from 'capture-core/metaData';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents.js';
import type { ProgramStageData } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: Array<ApiTEIEvent>,
    programStages: Array<ProgramStageData>,
    onDelete: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
