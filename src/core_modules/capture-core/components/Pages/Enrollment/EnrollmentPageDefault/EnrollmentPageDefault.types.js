// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    onDelete: () => void,
    widgetEffects: Object,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
