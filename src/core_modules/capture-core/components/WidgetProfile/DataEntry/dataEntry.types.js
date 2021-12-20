// @flow

export type PlainProps = {|
    dataEntryId: string,
    itemId: string,
    toggleEditModal: boolean,
    trackedEntityName: string,
    saveAttempted: boolean,
    formFoundation: any,
    onCancel: () => void,
    onSave: () => void,
    onUpdateFormField: () => void,
|};

export type Props = {|
    programAPI: any,
    orgUnitId: string,
    toggleEditModal: boolean,
    onCancel: () => void,
    trackedEntityInstanceAttributes: Array<any>,
|};
