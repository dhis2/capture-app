export type ContainerProps = {
    programId: string;
    orgUnitId?: string;
    selectedTemplateId?: string;
    trackedEntityTypeId?: string;
    displayFrontPageList?: boolean;
    onChangeTemplate?: (selectedTemplateId?: string) => void;
    setShowAccessible: () => void;
    mainPageStatus: string;
    error: boolean;
    ready: boolean;
    onOpenBulkDataEntryPlugin: (trackedEntityIds?: Array<string>) => void;
    onCloseBulkDataEntryPlugin: () => void;
    bulkDataEntryTrackedEntityIds?: Array<string>;
};
