// @flow

type PassOnProps = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
|}>;

export type Props = $ReadOnly<{|
    ...PassOnProps,
    setShowAccessible: () => void,
    MainPageStatus: boolean,
    ...CssClasses,
|}>;
