import { bulkDataEntryBreadcrumbsKeys } from '../Breadcrumbs/BulkDataEntryBreadcrumb';

export type PlainProps = {
    programId: string;
    page: keyof typeof bulkDataEntryBreadcrumbsKeys;
    onCloseBulkDataEntryPlugin: () => void;
    displayFrontPageList?: boolean;
    trackedEntityName?: string;
    trackedEntityIds?: Array<string>;
};
