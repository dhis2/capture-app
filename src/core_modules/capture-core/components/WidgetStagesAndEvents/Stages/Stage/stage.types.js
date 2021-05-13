// @flow
import type { ProgramStage } from '../../../../metaData';

export type Props = {|
    stage: ProgramStage,
    events: any,
    className?: string,
    ...CssClasses,
|};
