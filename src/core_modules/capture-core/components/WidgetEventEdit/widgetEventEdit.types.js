// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    programStage: ProgramStage,
    onGoBack: () => void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    ...CssClasses,
|};
