// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    mode: string,
    programStage: ProgramStage,
|};

export type PropsPlain = {|
    ...CssClasses,
    ...Props,
    onEdit: () => {},
|};
