// @flow

export type Props = {|
    title: string,
    placeholder: string,
    emptyCommentMessage: string,
    comments: Array<Object>,
    onAddComment: (comment: string) => void,
    ...CssClasses
|};
