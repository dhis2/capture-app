// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    attributes: any[]
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
