// @flow
type PropsFromRedux = {|
    dataEntryId: string,
    itemId: string,
    trackedEntityName: ?string,
    trackedEntityTypeId: ?string,
    newRelationshipProgramId: string,
    error: string,
|};

export type OwnProps = {|
    onLink: (teiId: string, values: Object) => void,
    onCancel: () => void,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: (itemId: string, dataEntryId: string) => void,
|};

export type Props = {|...PropsFromRedux, ...OwnProps, ...CssClasses |}
