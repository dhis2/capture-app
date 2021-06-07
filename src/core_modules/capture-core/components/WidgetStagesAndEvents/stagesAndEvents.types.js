// @flow
import type { ProgramStage } from '../../metaData';
import type { Event } from './types/common.types';

export type Props = {|
    stages: Map<string, ProgramStage>,
    programMetadata: any,
    events: Array<Event>,
    className?: string,
|};
