// @flow
import type { ProgramStage } from 'capture-core/metaData';
import type { Event, ProgramStageData } from '../../types/common.types';

export type Props = {|
    stage: ProgramStage,
    events: Array<Event>,
    programStage: ProgramStageData,
    className?: string,
    ...CssClasses,
|};
