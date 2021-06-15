// @flow
import type { ProgramStage } from '../../../metaData';

export type PlainProps = {|
    programStage: ?ProgramStage,
    mode: string,
    onEdit: () => {},
    ...CssClasses,
|};

export type Props = {|
    showEditEvent: ?boolean,
    onOpenEditEvent: () => {},
|};
