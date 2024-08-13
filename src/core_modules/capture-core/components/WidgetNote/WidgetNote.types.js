// @flow

export type Props = {|
    title: string,
    placeholder: string,
    emptyNoteMessage: string,
    notes: Array<Object>,
    onAddNote: (note: string) => void,
    ...CssClasses
|};
