// @flow

export type Props = {|
    onSchedule: () => Promise<void>,
    onCancel: () => void,
    ...CssClasses,
|};
