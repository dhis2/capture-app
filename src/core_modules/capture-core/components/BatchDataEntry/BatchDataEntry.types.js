// @flow
import { batchDataEntryBreadcrumbsKeys } from '../Breadcrumbs/BatchDataEntryBreadcrumb';

export type Props = {
    programId: string,
    page: $Values<typeof batchDataEntryBreadcrumbsKeys>,
    setShowBatchDataEntryPlugin: (show: boolean) => void,
    displayFrontPageList?: boolean,
    trackedEntityName?: string,
    ...CssClasses,
};
