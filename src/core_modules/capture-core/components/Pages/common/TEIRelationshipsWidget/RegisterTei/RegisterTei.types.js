// @flow
export type SharedProps = {|
    onLink: (teiId: string, values: Object) => void,
    onGetUnsavedAttributeValues?: ?Function,
    trackedEntityTypeId: string,
    onCancel: () => void,
|};

export type ContainerProps = {|
    suggestedProgramId: string,
    onSave: (teiPayload: Object) => void,
    ...SharedProps,
|};

export type ComponentProps = {|
    selectedScopeId: string,
    error: string,
    dataEntryId: string,
    trackedEntityName: ?string,
    onSaveWithEnrollment: () => void,
    onSaveWithoutEnrollment: () => void,
    ...SharedProps,
    ...CssClasses,
|};
