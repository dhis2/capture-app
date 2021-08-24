// @flow
import { ProgramStage } from '../../../metaData';

export type Props = {|
    programStage: ProgramStage,
    programId: string,
    orgUnitId: string,
    ...CssClasses,
|};
