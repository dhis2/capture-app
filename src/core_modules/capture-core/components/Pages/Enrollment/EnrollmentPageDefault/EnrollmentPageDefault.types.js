// @flow
import type { Program } from '../../../../metaData';

export type Props = {|
    program: Program,
    enrollmentId: string,
    teiId: string,
    programId: string,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
