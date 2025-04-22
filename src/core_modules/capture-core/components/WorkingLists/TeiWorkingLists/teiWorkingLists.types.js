
// @flow
export type Props = {|
    programId: string,
    orgUnitId: string,
    selectedTemplateId?: string,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
    setBulkDataEntryTrackedEntities: (trackedEntities: Array<string>) => void,
    ...CssClasses,
|};
