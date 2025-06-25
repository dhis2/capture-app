// @flow
import { bulkDataEntryBreadcrumbsKeys } from '../Breadcrumbs/BulkDataEntryBreadcrumb';

export type Props = {
    programId: string,
    page: $Values<typeof bulkDataEntryBreadcrumbsKeys>,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
    displayFrontPageList?: boolean,
    trackedEntityName?: string,
    ...CssClasses,
};
