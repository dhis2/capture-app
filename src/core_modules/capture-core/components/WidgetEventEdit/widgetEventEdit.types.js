// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    mode: string,
    programStage: ProgramStage,
    onEdit: () => {},
    ...CssClasses,
|};
