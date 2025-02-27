// @flow

export type Props = {|
    hasChanges: boolean,
    onSchedule: () => void,
    onCancel: () => void,
    validation?: ?{
        error: boolean,
        validationText: string,
    },
    ...CssClasses,
|};
