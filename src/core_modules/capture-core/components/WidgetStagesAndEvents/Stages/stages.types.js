// @flow
import type { ProgramStage } from '../../../metaData';
import type { Event } from '../types/common.types';

export type Props = {|
    stages: Map<string, ProgramStage>,
    events: Array<Event>,
    programMetadata: any,
    ...CssClasses,
|};
