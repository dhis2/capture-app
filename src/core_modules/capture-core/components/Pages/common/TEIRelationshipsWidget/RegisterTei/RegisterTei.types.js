// @flow
type PropsFromRedux = {|
    dataEntryId: string,
    itemId: string,
    trackedEntityName: ?string,
    error: string,
|};

export type OwnProps = {|
    onLink: (teiId: string, values: Object) => void,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: (itemId: string, dataEntryId: string) => void,
    suggestedProgramId: string,
    trackedEntityTypeId: string,
|};

export type Props = {|...PropsFromRedux, ...OwnProps, ...CssClasses |}
