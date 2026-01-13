export type MainPageComponentProps = {
    programId: string;
    orgUnitId?: string;
    selectedCategories: any
    selectedTemplateId?: string;
    trackedEntityTypeId?: string;
    displayFrontPageList?: boolean;
    onChangeTemplate?: (selectedTemplateId?: string) => void;
    onSetShowAccessible: () => void;
    mainPageStatus: string;
    error?: boolean;
    ready: boolean;
    onOpenBulkDataEntryPlugin: (trackedEntityIds?: Array<string>) => void;
    onCloseBulkDataEntryPlugin: () => void;
    bulkDataEntryTrackedEntityIds?: Array<string>;
};
