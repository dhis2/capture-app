// @flow
type PropsFromRedux = {|
    dataEntryId: string,
    trackedEntityName: ?string,
    newRelationshipProgramId: string,
    ready: boolean,
    error: string,
    possibleDuplicatesExist: ?boolean,
|};
type DispatchersFromRedux = {|
    onReviewDuplicates: (pageSize: number) => void,
|};

export type OwnProps = {|
    onLink: (teiId: string, values: Object) => void,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: Function,
|};

export type Props = {|...PropsFromRedux, ...OwnProps, ...DispatchersFromRedux, ...CssClasses |}
