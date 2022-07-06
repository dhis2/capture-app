// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    programStage: ProgramStage,
    eventStatus?: string,
    onGoBack: () => void,
    ...CssClasses,
|};
