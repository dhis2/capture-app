// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    programStage: ProgramStage,
    onGoBack: () => void,
    ...CssClasses,
|};
