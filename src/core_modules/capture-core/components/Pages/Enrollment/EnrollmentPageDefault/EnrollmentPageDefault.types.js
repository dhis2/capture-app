// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    widgetEffects: ?Object,
    onDelete: () => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
