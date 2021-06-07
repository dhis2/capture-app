// @flow
import type { Program } from 'capture-core/metaData';
import type { Event, ProgramStageData } from 'capture-core/components/WidgetStagesAndEvents/types/common.types';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: Array<Event>,
    programStages: Array<ProgramStageData>,
    onDelete: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
