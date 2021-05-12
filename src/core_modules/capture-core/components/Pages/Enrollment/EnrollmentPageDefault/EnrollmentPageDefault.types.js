// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    teiId: string,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
