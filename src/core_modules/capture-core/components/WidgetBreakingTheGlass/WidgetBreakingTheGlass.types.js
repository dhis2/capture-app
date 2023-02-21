// @flow

export type Props = {|
    programId: string,
    teiId: string,
    onBreakingTheGlass: Function,
    onCancel: Function,
|};

export type PlainProps = {|
    onBreakingTheGlass: Function,
    onCancel: Function,
    ...CssClasses,
|};
