// @flow
import type { ProgramStage } from '../../../../metaData';

export type Props = {|
    stage: ProgramStage,
    className?: string,
    ...CssClasses,
|};
