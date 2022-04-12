// @flow

type PassOnProps = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
|}>;

export type PlainProps = $ReadOnly<{|
    ...PassOnProps,
    setShowAccessible: () => void,
    MainPageStatus: boolean,
    ...CssClasses,
|}>;

export type Props = $ReadOnly<{|
    ...PassOnProps,
    ...PlainProps,
    error: boolean,
    ready: boolean,
|}>;
