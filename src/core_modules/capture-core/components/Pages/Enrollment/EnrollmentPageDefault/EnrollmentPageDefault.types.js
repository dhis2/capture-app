// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
