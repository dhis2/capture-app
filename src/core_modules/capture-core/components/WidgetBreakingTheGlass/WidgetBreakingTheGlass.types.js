// @flow

export type Props = {|
    programId: string,
    teiId: string,
    onBreakingTheGlass: (?string) => void,
    onCancel: () => void,
|};

export type PlainProps = {|
    onBreakingTheGlass: (?string) => void,
    onCancel: () => void,
    ...CssClasses,
|};
