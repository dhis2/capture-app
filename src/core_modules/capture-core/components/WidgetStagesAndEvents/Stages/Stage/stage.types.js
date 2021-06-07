// @flow
import type { ProgramStage } from 'capture-core/metaData';
import type { Event } from '../../types/common.types';

export type Props = {|
    stage: ProgramStage,
    events: Array<Event>,
    className?: string,
    programStage: any,
    ...CssClasses,
|};
