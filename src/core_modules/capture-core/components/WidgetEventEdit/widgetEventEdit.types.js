// @flow

import type { ProgramStage } from '../../metaData';

export type Props = {|
    mode: string,
    programStage: ProgramStage,
    eventId: string,
    onEdit: () => {},
|};

export type PlainProps = {|
    mode: string,
    programStage: ProgramStage,
        onEdit: () => {},
    ...CssClasses,
|};
