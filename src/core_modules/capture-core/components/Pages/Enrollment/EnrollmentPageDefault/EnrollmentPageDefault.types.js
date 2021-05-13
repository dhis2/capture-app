// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    teiId: string,
    events: any,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
