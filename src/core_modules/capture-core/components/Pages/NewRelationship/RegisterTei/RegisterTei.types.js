// @flow
type PropsFromRedux = {|
    dataEntryId: string,
    itemId: string,
    trackedEntityName: ?string,
    newRelationshipProgramId: string,
    ready: boolean,
    error: string,
|};

export type OwnProps = {|
    onLink: (teiId: string, values: Object) => void,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: (itemId: string, dataEntryId: string) => void,
|};

export type Props = {|...PropsFromRedux, ...OwnProps, ...CssClasses |}
