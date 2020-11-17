// @flow
type PassOnProps = $ReadOnly<{|
    mutationInProgress: boolean,
|}>;

export type Props = $ReadOnly<{|
    ...PassOnProps,
    isOnline: boolean,
    storeId: string,
|}>;
