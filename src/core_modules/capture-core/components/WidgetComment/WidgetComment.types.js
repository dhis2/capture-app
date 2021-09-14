// @flow

export type Props = {|
    comments: Array<Object>,
    onAddComment: (comment: string) => void,
    ...CssClasses
|};
