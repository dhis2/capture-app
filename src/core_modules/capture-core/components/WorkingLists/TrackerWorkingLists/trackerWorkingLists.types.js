// @flow
export type Props = {|
    programId: string,
    orgUnitId: string,
    selectedTemplateId?: string,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
    onOpenBulkDataEntryPlugin: (trackedEntityIds: Array<string>) => void,
    ...CssClasses,
|};
