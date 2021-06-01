// @flow
import type { ProgramStage } from '../../../metaData';

export type Props = {|
    eventAccess: { read: boolean, write: boolean },
    programStage: ?ProgramStage,
    mode: string,
    ...CssClasses,
|};
