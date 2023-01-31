// @flow

export type Props = {|
    programId: string,
    teiId: string,
    onBreakingTheGlass: Function,
|};

export type PlainProps = {|
    reason: string,
    setReason: Function,
    onBreakingTheGlass: Function,
    ...CssClasses,
|};
