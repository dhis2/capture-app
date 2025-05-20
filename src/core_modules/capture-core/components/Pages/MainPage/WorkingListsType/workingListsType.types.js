// @flow
export type Props = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    selectedTemplateId?: string,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
    onOpenBulkDataEntryPlugin: (trackedEntities: Array<string>) => void,
|}>;
