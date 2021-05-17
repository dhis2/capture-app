// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    events: any,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
