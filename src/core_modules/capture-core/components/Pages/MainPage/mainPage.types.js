// @flow

type PassOnProps = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
|}>;

export type Props = $ReadOnly<{|
    ...PassOnProps,
    currentSelectionsComplete: boolean,
    classes: Object,
|}>;
