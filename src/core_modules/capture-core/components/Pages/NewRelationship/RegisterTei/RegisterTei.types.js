// @flow
type PropsFromRedux = {|
    tetName: ?string,
    ready: boolean,
    error: string,
    possibleDuplicates: ?boolean,
|};
type DispatchersFromRedux = {|
    onReviewDuplicates: (pageSize: number) => void,
|};

export type OwnProps = {|
    onLink: (teiId: string) => void,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: Function,
|};

export type Props = {|...PropsFromRedux, ...OwnProps, ...DispatchersFromRedux, ...CssClasses |}
