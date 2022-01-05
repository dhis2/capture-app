// @flow

export type PlainProps = {|
    dataEntryId: string,
    itemId: string,
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
    onCancel: () => void,
    clientAttributesWithSubvalues: Array<any>,
|};
