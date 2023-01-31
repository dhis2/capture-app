// @flow

export type Props = {|
    programId: string,
    teiId: string,
    onBreakingTheGlass: Function,
|};

export type PlainProps = {|
    onBreakingTheGlass: Function,
    ...CssClasses,
|};
