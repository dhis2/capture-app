// @flow

export type Props = {|
    notes: Array<Object>,
    onAddNote: (note: string) => void,
    ...CssClasses
|};
