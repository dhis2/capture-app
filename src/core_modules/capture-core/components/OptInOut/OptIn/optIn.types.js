// @flow

export type Props = {|
    programId: string,
|};

export type PlainProps = {|
    handleOptIn: () => void,
    programName: string,
    loading: boolean,
    ...CssClasses
|};
