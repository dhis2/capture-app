// @flow
import { bulkDataEntryBreadcrumbsKeys } from '../Breadcrumbs/BulkDataEntryBreadcrumb';

export type Props = {
    programId: string,
    page: $Values<typeof bulkDataEntryBreadcrumbsKeys>,
    onCloseBulkDataEntryPlugin: () => void,
    displayFrontPageList?: boolean,
    trackedEntityName?: string,
    trackedEntityIds?: Array<string>,
    ...CssClasses,
};
