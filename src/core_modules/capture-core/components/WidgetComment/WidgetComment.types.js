// @flow

export type Props = {|
    comments: Array<Object>,
    onAddComment: (note: string) => void,
    ...CssClasses
|};
