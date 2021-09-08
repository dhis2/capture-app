// @flow

export type Props = {|
    title: string,
    placeholder: string,
    notes: Array<Object>,
    onAddNote: (note: string) => void,
    ...CssClasses
|};
