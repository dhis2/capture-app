// @flow
import type { ProgramStage } from '../../metaData';

export type Props = {|
    stages: Map<string, ProgramStage>,
    events: any,
    className?: string,
|};
