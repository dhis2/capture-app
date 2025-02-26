// @flow

export type Props = {|
    storeId: string,
    orgUnitId: string,
    programId?: string,
    programStageId?: string,
    selectedTemplateId?: string,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
|};
