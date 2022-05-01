// @flow

export type Props = {|
    programId: string,
|};

export type PlainProps = {|
    handleOptOut: () => void,
    programName: string,
    loading: boolean,
    ...CssClasses,
|};
