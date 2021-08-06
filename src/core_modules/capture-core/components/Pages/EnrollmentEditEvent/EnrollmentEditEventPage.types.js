// @flow
import type { ProgramStage } from '../../../metaData';

export type Props = {|
    programStage: ?ProgramStage,
    mode: string,
    ...CssClasses,
|};
