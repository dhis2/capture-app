// @flow

type PassOnProps = $ReadOnly<{
    programId: string,
}>;

export type Props = $ReadOnly<{
    ...PassOnProps,
    currentSelectionsComplete: boolean,
    classes: Object,
}>;
