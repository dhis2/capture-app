// @flow

import { ProgramStage } from '../../metaData';

export type Props = {|
    programStage: ProgramStage,
    currentScopeId: string,
    resultsPageSize: number,
    ...CssClasses,
|};
