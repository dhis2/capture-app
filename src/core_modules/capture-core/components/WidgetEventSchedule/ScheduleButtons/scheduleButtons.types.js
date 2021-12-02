// @flow

export type Props = {|
    hasChanges: boolean,
    onSchedule: () => void,
    onCancel: () => void,
    ...CssClasses,
|};
